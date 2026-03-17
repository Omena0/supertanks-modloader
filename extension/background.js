var MODS_INDEX_PATH = browser.runtime.getURL("mods/index.json");
var MODE_SETTINGS_KEY = "selectedMod";
var MODE_CONFIG_KEY = "modConfig";

var mods = {};
var selectedMod = "superhax";
var modConfig = {};

function loadMods() {
  return fetch(MODS_INDEX_PATH)
    .then(function (res) { return res.json(); })
    .then(function (json) {
      var list = (json && json.mods) ? json.mods : [];
      var pending = [];
      mods = {};
      for (var i = 0; i < list.length; i++) {
        (function (modMeta) {
          var manifestUrl = browser.runtime.getURL("mods/" + modMeta.id + "/manifest.json");
          pending.push(fetch(manifestUrl)
            .then(function (r) { return r.json(); })
            .then(function (manifest) {
              mods[modMeta.id] = manifest || { id: modMeta.id, name: modMeta.id, config: {} };
            }));
        })(list[i]);
      }
      return Promise.all(pending);
    })
    .catch(function (err) {
      console.error("[SuperTanks Mod] Failed to load mods metadata", err);
      mods = {};
    });
}

function loadSettings() {
  return browser.storage.local.get([MODE_SETTINGS_KEY, MODE_CONFIG_KEY])
    .then(function (data) {
      if (data && data[MODE_SETTINGS_KEY]) selectedMod = data[MODE_SETTINGS_KEY];
      if (data && data[MODE_CONFIG_KEY]) modConfig = data[MODE_CONFIG_KEY];
    })
    .catch(function (err) {
      console.error("[SuperTanks Mod] Failed to load settings", err);
    });
}

function getModMeta(modId) {
  if (mods && mods[modId]) return mods[modId];
  return mods.superhax || mods.vanilla || null;
}

function getModConfig(modId) {
  var base = {};
  var meta = getModMeta(modId);
  var schema = meta && meta.config ? meta.config : {};
  for (var key in schema) {
    if (!Object.prototype.hasOwnProperty.call(schema, key)) continue;
    if (schema[key].default !== undefined) {
      base[key] = schema[key].default;
    }
  }
  if (modConfig && modConfig[modId]) {
    var saved = modConfig[modId];
    for (var sk in saved) {
      if (Object.prototype.hasOwnProperty.call(saved, sk)) base[sk] = saved[sk];
    }
  }
  return base;
}

function buildModScriptUrl(modId) {
  var id = mods[modId] ? modId : (mods.superhax ? "superhax" : "vanilla");
  var cfg = getModConfig(id);
  var scriptPath = "mods/" + id + "/supertanks.js";
  var qs = "?mod=" + encodeURIComponent(id) + "&cfg=" + encodeURIComponent(JSON.stringify(cfg));
  return browser.runtime.getURL(scriptPath) + qs;
}

browser.runtime.onMessage.addListener(function (msg) {
  if (!msg || !msg.type) return;

  if (msg.type === "getModsAndSettings") {
    return Promise.resolve({
      mods: mods,
      selectedMod: selectedMod,
      modConfig: modConfig,
    });
  }

  if (msg.type === "saveSettings") {
    if (msg.selectedMod) selectedMod = msg.selectedMod;
    if (msg.modConfig) modConfig = msg.modConfig;
    return browser.storage.local.set({
      selectedMod: selectedMod,
      modConfig: modConfig,
    }).then(function () {
      return { ok: true };
    });
  }
});

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    var modId = mods[selectedMod] ? selectedMod : (mods.superhax ? "superhax" : "vanilla");
    var redirectUrl = buildModScriptUrl(modId);
    console.log("[SuperTanks Mod] Intercepting:", details.url, "->", modId);
    return { redirectUrl: redirectUrl };
  },
  {
    urls: [
      "*://supertanks-app-production-eu.herokuapp.com/supertanks.js*",
      "*://supertanks-app-production-eu.herokuapp.com/supertanks.js"
    ]
  },
  ["blocking"]
);

Promise.all([loadMods(), loadSettings()]).then(function () {
  console.log("[SuperTanks Mod] Extension loaded with mod:", selectedMod);
});
