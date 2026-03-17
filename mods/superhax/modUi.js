module.exports.createModPanel = function (mods) {
    var existing = document.getElementById("modPanel");
    if (existing) existing.remove();

    var panel = document.createElement("div");
    panel.id = "modPanel";
    panel.style.cssText = "position:fixed;top:200px;left:10px;z-index:10000;background:rgba(20,20,35,0.9);border:1px solid #4a6fa5;border-radius:8px;padding:10px 14px;font-family:monospace;font-size:12px;color:#ccc;min-width:160px;user-select:none;";

    var title = document.createElement("div");
    title.textContent = "MOD MENU";
    title.style.cssText = "font-weight:bold;font-size:13px;color:#4a9fff;margin-bottom:8px;text-align:center;border-bottom:1px solid #4a6fa5;padding-bottom:6px;";
    panel.appendChild(title);

    for (var i = 0; i < mods.length; i++) {
        (function (mod) {
            var row = document.createElement("div");
            row.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin:4px 0;";

            var label = document.createElement("span");
            label.textContent = mod.label + (mod.key ? " [" + mod.key + "]" : "");
            label.style.cssText = "flex:1;";

            var sw = document.createElement("div");
            sw.id = "mod-sw-" + mod.id;
            sw.style.cssText = "width:36px;height:18px;border-radius:9px;cursor:pointer;position:relative;transition:background 0.2s;" + (mod.get() ? "background:#4a9fff;" : "background:#555;");

            var knob = document.createElement("div");
            knob.style.cssText = "width:14px;height:14px;border-radius:7px;background:#fff;position:absolute;top:2px;transition:left 0.2s;" + (mod.get() ? "left:20px;" : "left:2px;");
            sw.appendChild(knob);

            sw.addEventListener("click", function () {
                var newVal = !mod.get();
                mod.set(newVal);
                sw.style.background = newVal ? "#4a9fff" : "#555";
                knob.style.left = newVal ? "20px" : "2px";
            });

            row.appendChild(label);
            row.appendChild(sw);
            panel.appendChild(row);
        })(mods[i]);
    }

    document.body.appendChild(panel);
};

module.exports.updateModSwitch = function (id, value) {
    var sw = document.getElementById("mod-sw-" + id);
    if (!sw) return;
    sw.style.background = value ? "#4a9fff" : "#555";
    sw.children[0].style.left = value ? "20px" : "2px";
};
