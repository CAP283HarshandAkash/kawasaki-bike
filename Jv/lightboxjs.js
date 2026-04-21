(function () {
  "use strict";

  var lightboxEl = null;
  var currentImages = [];
  var currentIndex = 0;
  var previousFocus = null;

  function createLightbox() {
    var overlay = KawasakiApp.createElement("div", {
      className: "lightbox-overlay",
      id: "lightbox",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Image viewer"
    });

    overlay.innerHTML = `
      <div class="lightbox-backdrop" data-action="close"></div>

      <div class="lightbox-content">
        <div class="lightbox-header">
          <span class="lightbox-counter" id="lbCounter">1 / 5</span>
          <div class="lightbox-actions">
            <button class="lightbox-btn" data-action="zoom"
                    aria-label="Toggle zoom" title="Toggle zoom">🔍</button>
            <button class="lightbox-btn" data-action="fullscreen"
                    aria-label="Toggle fullscreen" title="Fullscreen">⛶</button>
            <button class="lightbox-btn" data-action="close"
                    aria-label="Close viewer" title="Close (Esc)">✕</button>
          </div>
        </div>

        <div class="lightbox-body">
          <button class="lightbox-nav lightbox-prev" data-action="prev"
                  aria-label="Previous image" title="Previous (←)">‹</button>

          <div class="lightbox-image-wrap" id="lbImageWrap">
            <img id="lbImage" class="lightbox-image" src="" alt=""
                 draggable="false" />
            <div class="lightbox-loader" id="lbLoader">Loading...</div>
          </div>

          <button class="lightbox-nav lightbox-next" data-action="next"
                  aria-label="Next image" title="Next (→)">›</button>
        </div>

        <div class="lightbox-footer">
          <p class="lightbox-caption" id="lbCaption"></p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  /* ──────────────────────────────────────────
     OPEN / CLOSE / NAVIGATE
     ────────────────────────────────────────── */
  function openLightbox(images, startIndex) {
    if (!lightboxEl) {
      lightboxEl = createLightbox();
      bindLightboxEvents();
    }

    currentImages = images;
    currentIndex  = startIndex || 0;
    previousFocus = document.activeElement;

    showImage(currentIndex);
    lightboxEl.classList.add("open");
    document.body.style.overflow = "hidden";

    // Focus trap — focus the close button
    setTimeout(function () {
      var closeBtn = lightboxEl.querySelector('[data-action="close"]');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function closeLightbox() {
    if (!lightboxEl) return;

    lightboxEl.classList.remove("open");
    document.body.style.overflow = "";

    // Restore focus
    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  function showImage(index) {
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;
    currentIndex = index;

    var img     = KawasakiApp.$("#lbImage");
    var caption = KawasakiApp.$("#lbCaption");
    var counter = KawasakiApp.$("#lbCounter");
    var loader  = KawasakiApp.$("#lbLoader");
    var data    = currentImages[index];

    if (!img || !data) return;

    // Show loader
    loader.style.display = "block";
    img.style.opacity = "0";

    img.onload = function () {
      loader.style.display = "none";
      img.style.opacity = "1";
    };

    img.onerror = function () {
      loader.textContent = "Failed to load image";
    };

    img.src = data.src;
    img.alt = data.alt || "";
    caption.textContent = data.caption || "";
    counter.textContent = (index + 1) + " / " + currentImages.length;

    // Update nav button visibility
    var prevBtn = lightboxEl.querySelector(".lightbox-prev");
    var nextBtn = lightboxEl.querySelector(".lightbox-next");
    if (prevBtn) prevBtn.style.visibility = currentImages.length > 1 ? "visible" : "hidden";
    if (nextBtn) nextBtn.style.visibility = currentImages.length > 1 ? "visible" : "hidden";
  }

  function nextImage() {
    showImage(currentIndex + 1);
  }

  function prevImage() {
    showImage(currentIndex - 1);
  }

  /* ──────────────────────────────────────────
     ZOOM
     ────────────────────────────────────────── */
  var isZoomed = false;

  function toggleZoom() {
    var img = KawasakiApp.$("#lbImage");
    if (!img) return;

    isZoomed = !isZoomed;
    img.classList.toggle("zoomed", isZoomed);
  }

  /* ──────────────────────────────────────────
     FULLSCREEN
     ────────────────────────────────────────── */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      lightboxEl.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  }

  /* ──────────────────────────────────────────
     EVENT BINDING
     ────────────────────────────────────────── */
  function bindLightboxEvents() {
    // Delegate clicks
    lightboxEl.addEventListener("click", function (e) {
      var action = e.target.closest("[data-action]");
      if (!action) return;

      switch (action.dataset.action) {
        case "close":      closeLightbox(); break;
        case "prev":       prevImage(); break;
        case "next":       nextImage(); break;
        case "zoom":       toggleZoom(); break;
        case "fullscreen": toggleFullscreen(); break;
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", function (e) {
      if (!lightboxEl || !lightboxEl.classList.contains("open")) return;

      switch (e.key) {
        case "Escape":     closeLightbox(); break;
        case "ArrowLeft":  prevImage(); break;
        case "ArrowRight": nextImage(); break;
        case "ArrowUp":    toggleZoom(); break;
      }
    });

    // Swipe support (touch devices)
    var touchStartX = 0;
    var touchStartY = 0;

    lightboxEl.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightboxEl.addEventListener("touchend", function (e) {
      var diffX = e.changedTouches[0].screenX - touchStartX;
      var diffY = e.changedTouches[0].screenY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 60) {
        if (diffX > 0) {
          prevImage();
        } else {
          nextImage();
        }
      }

      // Swipe down to close
      if (diffY > 100 && Math.abs(diffY) > Math.abs(diffX)) {
        closeLightbox();
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────
     AUTO-ATTACH TO MEDIA ELEMENTS
     ────────────────────────────────────────── */
  KawasakiApp.onReady(function () {
    // Find all .media containers
    var mediaElements = KawasakiApp.$$(".media");
    if (mediaElements.length === 0) return;

    // Build image list
    var images = mediaElements.map(function (mediaEl) {
      var img = mediaEl.querySelector("img");
      var figcaption = mediaEl.closest("figure");
      var caption = figcaption ?
        figcaption.querySelector("figcaption") : null;

      return {
        src: img ? img.src : "",
        alt: img ? img.alt : "",
        caption: caption ? caption.textContent.trim() : ""
      };
    });

    // Attach click handlers
    mediaElements.forEach(function (mediaEl, index) {
      // Add visual indicator
      mediaEl.style.cursor = "zoom-in";

      // Add zoom icon
      var zoomIcon = KawasakiApp.createElement("span", {
        className: "media-zoom-icon",
        "aria-hidden": "true"
      }, "🔍");
      mediaEl.appendChild(zoomIcon);

      mediaEl.addEventListener("click", function (e) {
        // Don't trigger if clicking a link inside .media
        if (e.target.closest("a") && !e.target.closest(".media-zoom-icon")) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        openLightbox(images, index);
      });
    });
  });

  // Expose API
  KawasakiApp.lightbox = {
    open: openLightbox,
    close: closeLightbox,
    next: nextImage,
    prev: prevImage
  };

})();