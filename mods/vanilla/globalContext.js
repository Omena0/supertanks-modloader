var a;

a = (function () {
    return this;
})();

try {
    a = a || new Function("return this")();
} catch (e) {
    "object" == typeof window && (a = window);
}

module.exports = a;
