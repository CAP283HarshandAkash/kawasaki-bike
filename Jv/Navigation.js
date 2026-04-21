(function () {
  "use strict";

  var shortcutsPanel = null;

  var shortcuts = [
    { keys: ["Alt", "H"], action: "Go to Home",       fn: function () { window.location.href = "index.html"; } },
    { keys: ["Alt", "B"], action: "Go to Bikes",       fn: function () { window.location.href = "bikes.html"; } },
    { keys: ["Alt", "G"], action: "Go to Gallery",     fn: function () { window.location.href = "gallery.html"; } },
    { keys: ["Alt", "C"], action: "Go to Contact",     fn: function () { window.location.href = "contact.html"; } },
    { keys: ["Ctrl", "K"],action: "Focus search",      fn: function () { var s = KawasakiApp.$("#bikeSearch"); if (s) s.focus(); } },
    { keys: ["/"],         action: "Focus search",      fn: function () { var s = KawasakiApp.$("#bikeSearch"); if (s) s.focus(); } },
    { keys: ["Alt", "T"], action: "Toggle theme",      fn: function () { if (KawasakiApp.theme) KawasakiApp.theme.toggle(); } },
    { keys: ["Alt", "F"], action: "Toggle favorites",  fn: function () { var b = KawasakiApp.$("#favHeaderBtn"); if (b) b.click(); } },
    { keys: ["?"],         action: "Show shortcuts",    fn: toggleShortcutsPanel },
    { keys: ["Escape"],    action: "Close panel/modal", fn: function () { if (shortcutsPanel) toggleShortcutsPanel(); } }
  ];

  /* ──────────────────────────────────────────
     KEYBOARD EVENT HANDLER
     ────────────────────────────────────────── */
  document.addEventListener("keydown", function (e) {
    // Don't trigger inside inputs/textareas
    if (e.target.matches("input, textarea, select")) {
      // Exception: Escape always works
      if (e.key !== "Escape") return;
    }

    shortcuts.forEach(function (shortcut) {
      var match = false;

      if (shortcut.keys.length === 2) {
        var modifier = shortcut.keys[0];
        var key = shortcut.keys[1];

        if (modifier === "Alt" && e.altKey && e.key.toUpperCase() === key) match = true;
        if (modifier === "Ctrl" && (e.ctrlKey || e.metaKey) && e.key.toUpperCase() === key) match = true;
      } else if (shortcut.keys.length === 1) {
        if (e.key === shortcut.keys[0] && !e.altKey && !e.ctrlKey && !e.metaKey) match = true;
      }

      if (match) {
        e.preventDefault();
        shortcut.fn();
      }
    });
  });


  function toggleShortcutsPanel() {
    if (shortcutsPanel) {
      shortcutsPanel.remove();
      shortcutsPanel = null;
      return;
    }

    shortcutsPanel = KawasakiApp.createElement("div", {
      className: "shortcuts-panel",
      role: "dialog",
      "aria-label": "Keyboard shortcuts"
    });

    var html = '<h3 style="margin: 0 0 14px;">⌨️ Keyboard Shortcuts</h3>';
    html += '<div class="shortcuts-grid">';

    shortcuts.forEach(function (s) {
      if (s.keys[0] === "Escape") return;
      html += '<div class="shortcut-item">';
      html += '<span class="shortcut-keys">';
      s.keys.forEach(function (key, i) {
        if (i > 0) html += ' + ';
        html += '<kbd>' + key + '</kbd>';
      });
      html += '</span>';
      html += '<span class="shortcut-desc">' + s.action + '</span>';
      html += '</div>';
    });

    html += '</div>';
    html += '<p class="muted" style="margin: 12px 0 0; font-size: 12px; text-align: center;">Press <kbd>?</kbd> or <kbd>Esc</kbd> to close</p>';

    shortcutsPanel.innerHTML = html;

    // Close button
    var closeBtn = KawasakiApp.createElement("button", {
      className: "shortcuts-close",
      "aria-label": "Close shortcuts panel",
      onClick: toggleShortcutsPanel
    }, "✕");

    shortcutsPanel.appendChild(closeBtn);
    document.body.appendChild(shortcutsPanel);
  }

  /* ──────────────────────────────────────────
     PROGRESS BAR (reading progress)
     ────────────────────────────────────────── */
  function initProgressBar() {
    var bar = KawasakiApp.createElement("div", {
      className: "reading-progress",
      id: "readingProgress",
      role: "progressbar",
      "aria-label": "Page scroll progress"
    });

    document.body.prepend(bar);

    var updateProgress = KawasakiApp.throttle(function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + "%";
    }, 16);

    window.addEventListener("scroll", updateProgress, { passive: true });
  }


  KawasakiApp.onReady(function () {
    initProgressBar();
  });

})();