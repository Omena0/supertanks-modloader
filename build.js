#!/usr/bin/env node
/**
 * build.js - Builds all mods from /mods into /extension/mods/<modId>/supertanks.js
 * using /mods/vanilla as fallback for missing module files.
 *
 * Module IDs are assigned incrementally per bundle from the discovered dependency graph.
 */

const fs = require('fs');
const path = require('path');

const ENTRY_MODULE_NAME = 'gameClient';
const ROOT_DIR = __dirname;
const MODS_DIR = path.join(ROOT_DIR, 'mods');
const OUT_DIR = path.join(ROOT_DIR, 'extension');
const OUT_MODS_DIR = path.join(OUT_DIR, 'mods');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listModuleNames(dirPath) {
    if (!fs.existsSync(dirPath)) return [];
    return fs.readdirSync(dirPath)
        .filter(function (name) { return name.endsWith('.js'); })
        .map(function (name) { return name.slice(0, -3); });
}

function readModule(name, sourceDir, fallbackDir) {
    const fromSource = path.join(sourceDir, name + '.js');
    if (fs.existsSync(fromSource)) return fs.readFileSync(fromSource, 'utf8');

    const fromFallback = path.join(fallbackDir, name + '.js');
    if (fs.existsSync(fromFallback)) return fs.readFileSync(fromFallback, 'utf8');

    throw new Error('Missing module file ' + name + '.js in ' + sourceDir + ' and fallback ' + fallbackDir);
}

function extractRequires(source) {
    const out = [];
    const seen = Object.create(null);
    const re = /require\(["']\.\/([^"']+)["']\)/g;
    let m;
    while ((m = re.exec(source)) !== null) {
        const req = m[1];
        if (!seen[req]) {
            seen[req] = true;
            out.push(req);
        }
    }
    return out;
}

function discoverBundleModules(sourceDir, fallbackDir, entryName) {
    const available = Object.create(null);
    const fromSource = listModuleNames(sourceDir);
    const fromFallback = listModuleNames(fallbackDir);

    for (let i = 0; i < fromFallback.length; i++) available[fromFallback[i]] = true;
    for (let i = 0; i < fromSource.length; i++) available[fromSource[i]] = true;

    if (!available[entryName]) {
        throw new Error('Entry module ' + entryName + '.js not found in ' + sourceDir + ' or fallback ' + fallbackDir);
    }

    const order = [];
    const visiting = Object.create(null);
    const visited = Object.create(null);

    function visit(name) {
        if (visited[name]) return;
        if (visiting[name]) {
            throw new Error('Cyclic require chain detected at module: ' + name);
        }
        if (!available[name]) {
            throw new Error('Module required but missing: ' + name + '.js');
        }

        visiting[name] = true;
        const source = readModule(name, sourceDir, fallbackDir);
        const deps = extractRequires(source);
        for (let i = 0; i < deps.length; i++) {
            visit(deps[i]);
        }

        visiting[name] = false;
        visited[name] = true;
        order.push(name);
    }

    visit(entryName);

    const moduleMap = Object.create(null);
    for (let i = 0; i < order.length; i++) {
        moduleMap[order[i]] = i;
    }

    return { order, moduleMap, entryId: moduleMap[entryName] };
}

function transformModule(name, source, moduleMap) {
    const transformedRequires = source.replace(
        /require\(["']\.\/([^"']+)["']\)/g,
        function (match, reqName) {
            if (Object.prototype.hasOwnProperty.call(moduleMap, reqName)) {
                return 'a(' + moduleMap[reqName] + ')';
            }
            throw new Error('Unknown require("./' + reqName + '") in module ' + name + '.js');
        }
    );

    const transformed = transformedRequires.replace(/module\.exports/g, 't.exports');

    // Keep globalContext as 2-arg for parity with legacy bundle style.
    if (name === 'globalContext') {
        return 'function(t, e) {\n' + transformed + '\n}';
    }

    return 'function(t, e, a) {\n' + transformed + '\n}';
}

const BABEL_HELPERS = `function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null)
        throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, writable: true, configurable: true }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
function _get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        return parent === null ? undefined : _get(parent, property, receiver);
    }
    if ("value" in desc) return desc.value;
    var getter = desc.get;
    return getter === undefined ? undefined : getter.call(receiver);
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
`;

function makeBootstrap(entryId) {
    return `var EntryPoint = (function (t) {
    var e = {};
    function a(n) {
        if (e[n]) return e[n].exports;
        var l = (e[n] = { i: n, l: !1, exports: {} });
        return (t[n].call(l.exports, l, l.exports, a), (l.l = !0), l.exports);
    }
    return (
        (a.m = t),
        (a.c = e),
        (a.d = function (t, e, n) {
            a.o(t, e) ||
                Object.defineProperty(t, e, { enumerable: !0, get: n });
        }),
        (a.r = function (t) {
            ("undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(t, Symbol.toStringTag, {
                    value: "Module",
                }),
                Object.defineProperty(t, "__esModule", { value: !0 }));
        }),
        (a.t = function (t, e) {
            if ((1 & e && (t = a(t)), 8 & e)) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var n = Object.create(null);
            if (
                (a.r(n),
                    Object.defineProperty(n, "default", {
                        enumerable: !0,
                        value: t,
                    }),
                    2 & e && "string" != typeof t)
            )
                for (var l in t)
                    a.d(
                        n,
                        l,
                        function (e) {
                            return t[e];
                        }.bind(null, l),
                    );
            return n;
        }),
        (a.n = function (t) {
            var e =
                t && t.__esModule
                    ? function () {
                        return t.default;
                    }
                    : function () {
                        return t;
                    };
            return (a.d(e, "a", e), e);
        }),
        (a.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }),
        (a.p = ""),
        a((a.s = ${entryId}))
    );
})([`;
}

function buildBundle(sourceDir, fallbackDir, outPath) {
    ensureDir(path.dirname(outPath));

    const graph = discoverBundleModules(sourceDir, fallbackDir, ENTRY_MODULE_NAME);
    const modules = [];

    for (let i = 0; i < graph.order.length; i++) {
        const name = graph.order[i];
        console.log('Packing module ' + i + ': ' + name + '.js');
        const source = readModule(name, sourceDir, fallbackDir);
        modules.push(transformModule(name, source, graph.moduleMap));
    }

    const bundle = BABEL_HELPERS + makeBootstrap(graph.entryId) + '\n' + modules.join(',\n') + '\n]);';
    fs.writeFileSync(outPath, bundle, 'utf8');
    console.log('\nBundle written to: ' + outPath);
    console.log('Size: ' + (Buffer.byteLength(bundle) / 1024).toFixed(1) + ' KB\n');
}

function discoverMods() {
    if (!fs.existsSync(MODS_DIR)) throw new Error('mods directory not found: ' + MODS_DIR);

    const dirs = fs.readdirSync(MODS_DIR, { withFileTypes: true })
        .filter(function (d) { return d.isDirectory(); })
        .map(function (d) { return d.name; })
        .sort();

    const mods = [];
    for (let i = 0; i < dirs.length; i++) {
        const modId = dirs[i];
        const modDir = path.join(MODS_DIR, modId);
        const manifestPath = path.join(modDir, 'manifest.json');
        if (!fs.existsSync(manifestPath)) {
            console.warn('Skipping mod without manifest.json:', modId);
            continue;
        }
        const manifest = readJson(manifestPath);
        if (!manifest.id) manifest.id = modId;
        mods.push({ id: modId, dir: modDir, manifest: manifest });
    }

    return mods;
}

function writeModMetadata(mod) {
    const outModDir = path.join(OUT_MODS_DIR, mod.id);
    ensureDir(outModDir);
    const manifestOut = path.join(outModDir, 'manifest.json');
    fs.writeFileSync(manifestOut, JSON.stringify(mod.manifest, null, 2) + '\n', 'utf8');
}

function writeModsIndex(mods) {
    const indexPath = path.join(OUT_MODS_DIR, 'index.json');
    const index = {
        mods: mods.map(function (m) {
            return {
                id: m.id,
                name: m.manifest.name || m.id,
                description: m.manifest.description || '',
                version: m.manifest.version || '0.0.0'
            };
        })
    };
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');
}

function build() {
    ensureDir(OUT_DIR);
    ensureDir(OUT_MODS_DIR);

    const mods = discoverMods();
    if (!mods.length) throw new Error('No mods discovered under /mods');

    const vanilla = mods.find(function (m) { return m.id === 'vanilla'; });
    if (!vanilla) throw new Error('mods/vanilla/manifest.json is required as fallback base');

    for (let i = 0; i < mods.length; i++) {
        const mod = mods[i];
        console.log('=== Building mod:', mod.id, '===');
        const outPath = path.join(OUT_MODS_DIR, mod.id, 'supertanks.js');
        buildBundle(mod.dir, vanilla.dir, outPath);
        writeModMetadata(mod);
    }

    writeModsIndex(mods);
}

build();
