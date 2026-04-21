(function () {
  "use strict";

  var FAV_KEY = "favorites";

  function getFavorites() {
    return KawasakiApp.loadData(FAV_KEY, []);
  }

  function saveFavorites(favs) {
    KawasakiApp.saveData(FAV_KEY, favs);
    updateFavCount();
    showNotification(null);
  }

  function isFavorite(bikeId) {
    return getFavorites().indexOf(bikeId) !== -1;
  }

  function toggleFavorite(bikeId, bikeName) {
    var favs = getFavorites();
    var index = favs.indexOf(bikeId);

    if (index === -1) {
      favs.push(bikeId);
      showNotification("❤️ " + (bikeName || bikeId) + " added to wishlist!");
    } else {
      favs.splice(index, 1);
      showNotification("💔 " + (bikeName || bikeId) + " removed from wishlist.");
    }

    saveFavorites(favs);
    updateAllButtons();
  }

  /* ──────────────────────────────────────────
     UPDATE FAV COUNT IN HEADER
     ────────────────────────────────────────── */
  function updateFavCount() {
    var badge = KawasakiApp.$("#favBadge");
    var count = getFavorites().length;

    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  /* ──────────────────────────────────────────
     CREATE FAV BUTTON ON EACH BIKE CARD
     ────────────────────────────────────────── */
  function createFavButtons() {
    var bikeLinks = {
      "ninja-zx10r.html": { id: "ninja-zx10r", name: "Ninja ZX-10R" },
      "z900.html":        { id: "z900", name: "Z900" },
      "versys-650.html":  { id: "versys-650", name: "Versys 650" },
      "vulcan-s.html":    { id: "vulcan-s", name: "Vulcan S" },
      "klr650.html":      { id: "klr650", name: "KLR650" }
    };

    // Find all media containers with bike links
    KawasakiApp.$$(".media").forEach(function (mediaEl) {
      var parentLink = mediaEl.closest("a");
      if (!parentLink) return;

      var href = parentLink.getAttribute("href");
      var bikeInfo = bikeLinks[href];
      if (!bikeInfo) return;

      var isFav = isFavorite(bikeInfo.id);

      var favBtn = KawasakiApp.createElement("button", {
        className: "fav-btn" + (isFav ? " active" : ""),
        "aria-label": (isFav ? "Remove " : "Add ") + bikeInfo.name +
                      (isFav ? " from" : " to") + " wishlist",
        "data-bike-id": bikeInfo.id,
        "data-bike-name": bikeInfo.name,
        title: isFav ? "Remove from wishlist" : "Add to wishlist",
        onClick: function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(bikeInfo.id, bikeInfo.name);
        }
      }, isFav ? "❤️" : "🤍");

      mediaEl.appendChild(favBtn);
    });
  }

  /* ──────────────────────────────────────────
     UPDATE ALL FAV BUTTONS
     ────────────────────────────────────────── */
  function updateAllButtons() {
    KawasakiApp.$$(".fav-btn").forEach(function (btn) {
      var bikeId = btn.dataset.bikeId;
      var isFav = isFavorite(bikeId);

      btn.textContent = isFav ? "❤️" : "🤍";
      btn.classList.toggle("active", isFav);
      btn.setAttribute("aria-label",
        (isFav ? "Remove " : "Add ") + btn.dataset.bikeName +
        (isFav ? " from" : " to") + " wishlist"
      );
      btn.title = isFav ? "Remove from wishlist" : "Add to wishlist";
    });
  }

  /* ──────────────────────────────────────────
     CREATE HEADER FAV ICON
     ────────────────────────────────────────── */
  function createHeaderIcon() {
    var count = getFavorites().length;

    var favContainer = KawasakiApp.createElement("div", {
      className: "fav-header-icon",
      title: "Your wishlist"
    });

    favContainer.innerHTML = `
      <button class="fav-header-btn" aria-label="View wishlist"
              id="favHeaderBtn">
        ❤️
        <span class="fav-badge" id="favBadge"
              style="display: ${count > 0 ? 'flex' : 'none'}">
          ${count}
        </span>
      </button>
    `;

    var topbar = KawasakiApp.$(".topbar");
    var themeToggle = KawasakiApp.$("#themeToggle");
    var menuToggle = KawasakiApp.$("#menuToggle");

    if (topbar) {
      var insertBefore = themeToggle || menuToggle;
      if (insertBefore) {
        topbar.insertBefore(favContainer, insertBefore);
      } else {
        topbar.appendChild(favContainer);
      }
    }

    // Click to show favorites panel
    KawasakiApp.$("#favHeaderBtn").addEventListener("click", function () {
      showFavoritesPanel();
    });
  }

  /* ──────────────────────────────────────────
     FAVORITES PANEL (Dropdown)
     ────────────────────────────────────────── */
  function showFavoritesPanel() {
    // Remove existing panel
    var existing = KawasakiApp.$("#favPanel");
    if (existing) {
      existing.remove();
      return;
    }

    var favs = getFavorites();

    var bikeNames = {
      "ninja-zx10r": "Ninja ZX-10R",
      "z900": "Z900",
      "versys-650": "Versys 650",
      "vulcan-s": "Vulcan S",
      "klr650": "KLR650"
    };

    var bikePages = {
      "ninja-zx10r": "ninja-zx10r.html",
      "z900": "z900.html",
      "versys-650": "versys-650.html",
      "vulcan-s": "vulcan-s.html",
      "klr650": "klr650.html"
    };

    var panel = KawasakiApp.createElement("div", {
      className: "fav-panel",
      id: "favPanel"
    });

    var content = '<h3 style="margin: 0 0 10px; font-size: 16px;">❤️ Your Wishlist</h3>';

    if (favs.length === 0) {
      content += '<p class="muted" style="font-size: 14px;">No bikes saved yet. Click the heart icon on any bike to add it.</p>';
    } else {
      content += '<ul class="fav-list">';
      favs.forEach(function (bikeId) {
        var name = bikeNames[bikeId] || bikeId;
        var page = bikePages[bikeId] || "#";
        content += '<li>';
        content += '<a href="' + page + '">' + name + '</a>';
        content += '<button class="fav-remove-btn" data-remove="' + bikeId + '" aria-label="Remove ' + name + '">✕</button>';
        content += '</li>';
      });
      content += '</ul>';

      if (favs.length > 1) {
        content += '<button class="fav-clear-btn" id="favClearAll">Clear All</button>';
      }
    }

    panel.innerHTML = content;
    document.body.appendChild(panel);

    // Bind remove buttons
    KawasakiApp.$$(".fav-remove-btn", panel).forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleFavorite(btn.dataset.remove, bikeNames[btn.dataset.remove]);
        panel.remove();
        showFavoritesPanel(); // Refresh
      });
    });

    // Clear all
    var clearBtn = KawasakiApp.$("#favClearAll");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        KawasakiApp.saveData(FAV_KEY, []);
        updateFavCount();
        updateAllButtons();
        panel.remove();
        showNotification("Wishlist cleared.");
      });
    }

    // Close on outside click
    setTimeout(function () {
      document.addEventListener("click", function closePanel(e) {
        if (!panel.contains(e.target) && !e.target.closest("#favHeaderBtn")) {
          panel.remove();
          document.removeEventListener("click", closePanel);
        }
      });
    }, 100);
  }

  /* ──────────────────────────────────────────
     NOTIFICATION (Toast)
     ────────────────────────────────────────── */
  function showNotification(message) {
    if (!message) return;

    var existing = KawasakiApp.$(".toast-notification");
    if (existing) existing.remove();

    var toast = KawasakiApp.createElement("div", {
      className: "toast-notification",
      role: "status",
      "aria-live": "polite"
    }, message);

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    // Auto-remove
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 3000);
  }

  
  KawasakiApp.onReady(function () {
    createHeaderIcon();
    createFavButtons();
  });

  // Expose API
  KawasakiApp.favorites = {
    get: getFavorites,
    toggle: toggleFavorite,
    isFavorite: isFavorite
  };

})();