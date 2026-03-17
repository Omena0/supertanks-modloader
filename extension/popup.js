(function () {
  var modSelect = document.getElementById("modSelect");
  var modDescription = document.getElementById("modDescription");
  var configContainer = document.getElementById("configContainer");
  var saveBtn = document.getElementById("saveBtn");
  var statusEl = document.getElementById("status");

  var mods = {};
  var selectedMod = "superhax";
  var modConfig = {};

  function setStatus(msg, isError) {
    statusEl.textContent = msg || "";
    statusEl.style.color = isError ? "#ff7b7b" : "#8bd67f";
  }

  function ensureModConfig(modId) {
    if (!modConfig[modId]) modConfig[modId] = {};
    return modConfig[modId];
  }

  function renderConfig(modId) {
    configContainer.innerHTML = "";
    var mod = mods[modId];
    if (!mod) return;

    modDescription.textContent = mod.description || "";

    var schema = mod.config || {};
    var cfg = ensureModConfig(modId);

    Object.keys(schema).forEach(function (key) {
      var spec = schema[key] || {};
      var wrap = document.createElement("div");
      wrap.className = "cfg";

      var label = document.createElement("label");
      label.className = "label";
      label.textContent = spec.name || key;
      wrap.appendChild(label);

      var defaultVal = spec.default;
      if (cfg[key] === undefined && defaultVal !== undefined) cfg[key] = defaultVal;

      if (spec.inputType === "slider") {
        var row = document.createElement("div");
        row.className = "rangeRow";

        var input = document.createElement("input");
        input.type = "range";
        input.min = spec.range && spec.range[0] !== undefined ? spec.range[0] : 0;
        input.max = spec.range && spec.range[1] !== undefined ? spec.range[1] : 100;
        input.step = spec.type === "integer" ? 1 : 0.1;
        input.value = cfg[key] !== undefined ? cfg[key] : input.min;

        var value = document.createElement("div");
        value.className = "value";
        value.textContent = input.value;

        input.addEventListener("input", function () {
          var v = spec.type === "integer" ? parseInt(input.value, 10) : parseFloat(input.value);
          cfg[key] = v;
          value.textContent = String(v);
        });

        row.appendChild(input);
        row.appendChild(value);
        wrap.appendChild(row);
      } else {
        var text = document.createElement("input");
        text.type = spec.type === "integer" ? "number" : "text";
        if (spec.range) {
          text.min = spec.range[0];
          text.max = spec.range[1];
        }
        text.value = cfg[key] !== undefined ? cfg[key] : "";
        text.addEventListener("change", function () {
          var v = text.value;
          if (spec.type === "integer") v = parseInt(v, 10);
          cfg[key] = v;
        });
        wrap.appendChild(text);
      }

      configContainer.appendChild(wrap);
    });
  }

  function renderModSelect() {
    modSelect.innerHTML = "";
    Object.keys(mods).forEach(function (id) {
      var opt = document.createElement("option");
      opt.value = id;
      opt.textContent = mods[id].name || id;
      if (id === selectedMod) opt.selected = true;
      modSelect.appendChild(opt);
    });
    renderConfig(selectedMod);
  }

  modSelect.addEventListener("change", function () {
    selectedMod = modSelect.value;
    renderConfig(selectedMod);
  });

  saveBtn.addEventListener("click", function () {
    browser.runtime.sendMessage({
      type: "saveSettings",
      selectedMod: selectedMod,
      modConfig: modConfig,
    }).then(function () {
      setStatus("Saved. Reload game tabs to apply.", false);
    }).catch(function (err) {
      setStatus("Save failed: " + err, true);
    });
  });

  browser.runtime.sendMessage({ type: "getModsAndSettings" })
    .then(function (data) {
      mods = data && data.mods ? data.mods : {};
      selectedMod = data && data.selectedMod ? data.selectedMod : "superhax";
      modConfig = data && data.modConfig ? data.modConfig : {};
      renderModSelect();
    })
    .catch(function (err) {
      setStatus("Load failed: " + err, true);
    });
})();
