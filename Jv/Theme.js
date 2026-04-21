(function () {
  "use strict";

  var THEME_KEY = "theme";
  var DARK = "dark";
  var LIGHT = "light";


  var themes = {
    dark: {
      "--bg":              "#05070a",
      "--text-primary":    "#f5f7fa",
      "--text-secondary":  "#e8edf3",
      "--muted":           "#b8c2cc",
      "--card":            "rgba(12, 16, 20, 0.72)",
      "--line":            "rgba(255, 255, 255, 0.12)",
      "--line-strong":     "rgba(255, 255, 255, 0.18)",
      "--overlay":         "rgba(0, 0, 0, 0.62)",
      "--overlay-light":   "rgba(0, 0, 0, 0.55)",
      "--white-subtle":    "rgba(255, 255, 255, 0.06)",
      "--white-faint":     "rgba(255, 255, 255, 0.03)"
    },
    light: {
      "--bg":              "#f0f2f5",
      "--text-primary":    "#1a1a2e",
      "--text-secondary":  "#2d2d44",
      "--muted":           "#6b7280",
      "--card":            "rgba(255, 255, 255, 0.92)",
      "--line":            "rgba(0, 0, 0, 0.1)",
      "--line-strong":     "rgba(0, 0, 0, 0.18)",
      "--overlay":         "rgba(255, 255, 255, 0.85)",
      "--overlay-light":   "rgba(255, 255, 255, 0.75)",
      "--white-subtle":    "rgba(0, 0, 0, 0.04)",
      "--white-faint":     "rgba(0, 0, 0, 0.02)"
    }
  };


  function applyTheme(themeName) {
    var root = document.documentElement;
    var vars = themes[themeName];

    if (!vars) return;

    Object.keys(vars).forEach(function (prop) {
      root.style.setProperty(prop, vars[prop]);
    });

    document.body.setAttribute("data-theme", themeName);
    KawasakiApp.saveData(THEME_KEY, themeName);

    // Update toggle button
    var btn = KawasakiApp.$("#themeToggle");
    if (btn) {
      btn.textContent = themeName === DARK ? "☀️" : "🌙";
      btn.setAttribute("aria-label",
        "Switch to " + (themeName === DARK ? "light" : "dark") + " mode"
      );
      btn.title = "Switch to " + (themeName === DARK ? "light" : "dark") + " mode";
    }
  }

  function getPreferredTheme() {
    // 1. Check localStorage
    var saved = KawasakiApp.loadData(THEME_KEY, null);
    if (saved && themes[saved]) return saved;

    // 2. Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return LIGHT;
    }

    // 3. Default to dark
    return DARK;
  }

  /* ──────────────────────────────────────────
     TOGGLE THEME
     ────────────────────────────────────────── */
  function toggleTheme() {
    var current = document.body.getAttribute("data-theme") || DARK;
    var next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
  }

  /* ──────────────────────────────────────────
     CREATE TOGGLE BUTTON
     ────────────────────────────────────────── */
  function createToggleButton() {
    var btn = KawasakiApp.createElement("button", {
      id: "themeToggle",
      className: "theme-toggle",
      "aria-label": "Switch to light mode",
      title: "Switch to light mode",
      onClick: toggleTheme
    }, "☀️");

    // Insert into topbar (after brand, before nav)
    var topbar = KawasakiApp.$(".topbar");
    var menuToggle = KawasakiApp.$("#menuToggle");

    if (topbar && menuToggle) {
      topbar.insertBefore(btn, menuToggle);
    } else if (topbar) {
      topbar.appendChild(btn);
    }
  }

  /* ──────────────────────────────────────────
     LISTEN FOR SYSTEM THEME CHANGES
     ────────────────────────────────────────── */
  function watchSystemTheme() {
    if (!window.matchMedia) return;

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      // Only auto-switch if user hasn't manually set a preference
      var saved = KawasakiApp.loadData(THEME_KEY, null);
      if (!saved) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

  /* ──────────────────────────────────────────
     INITIALIZE
     ────────────────────────────────────────── */
  KawasakiApp.onReady(function () {
    createToggleButton();
    applyTheme(getPreferredTheme());
    watchSystemTheme();
  });

  // Expose for external use
  KawasakiApp.theme = {
    toggle: toggleTheme,
    set: applyTheme,
    get: function () {
      return document.body.getAttribute("data-theme") || DARK;
    }
  };

})();