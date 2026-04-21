(function () {
  "use strict";

  if (KawasakiApp.prefersReducedMotion()) return;



  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px 0px -60px 0px",
      threshold: 0.1
    });

    // Observe elements with data-reveal attribute
    KawasakiApp.$$("[data-reveal]").forEach(function (el) {
      observer.observe(el);
    });

    // Auto-observe common elements
    var autoRevealSelectors = [
      ".bike-row figure",
      ".model-grid article",
      ".grid .card",
      ".banner"
    ];

    autoRevealSelectors.forEach(function (selector) {
      KawasakiApp.$$(selector).forEach(function (el, index) {
        if (!el.hasAttribute("data-reveal")) {
          el.setAttribute("data-reveal", "fade-up");
          el.style.transitionDelay = (index * 0.08) + "s";
          observer.observe(el);
        }
      });
    });
  }

  /* ──────────────────────────────────────────
     ANIMATED COUNTERS (for stats)
     ────────────────────────────────────────── */
  function initAnimatedCounters() {
    if (!("IntersectionObserver" in window)) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.dataset.count, 10);
          var prefix = el.dataset.prefix || "";
          var suffix = el.dataset.suffix || "";
          var duration = parseInt(el.dataset.duration, 10) || 1500;

          KawasakiApp.animateCounter(el, target, duration, prefix, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    KawasakiApp.$$("[data-count]").forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ──────────────────────────────────────────
     PARALLAX EFFECT (subtle)
     ────────────────────────────────────────── */
  function initParallax() {
    var parallaxElements = KawasakiApp.$$("[data-parallax]");
    if (parallaxElements.length === 0) return;

    var handleParallax = KawasakiApp.throttle(function () {
      var scrollY = window.scrollY;

      parallaxElements.forEach(function (el) {
        var speed = parseFloat(el.dataset.parallax) || 0.3;
        var offset = scrollY * speed;
        el.style.transform = "translateY(" + offset + "px)";
      });
    }, 16); // ~60fps

    window.addEventListener("scroll", handleParallax, { passive: true });
  }

  /* ──────────────────────────────────────────
     TYPING EFFECT (for headings)
     ────────────────────────────────────────── */
  function initTypingEffect() {
    var typingElements = KawasakiApp.$$("[data-typing]");

    typingElements.forEach(function (el) {
      var text = el.textContent;
      var speed = parseInt(el.dataset.typingSpeed, 10) || 60;
      el.textContent = "";
      el.style.borderRight = "2px solid var(--kawa-green-2)";

      var i = 0;
      function type() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          // Remove cursor after typing
          setTimeout(function () {
            el.style.borderRight = "none";
          }, 1000);
        }
      }

      // Start when visible
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) {
            type();
            obs.unobserve(el);
          }
        }, { threshold: 0.5 });
        obs.observe(el);
      } else {
        type();
      }
    });
  }

  KawasakiApp.onReady(function () {
    initScrollReveal();
    initAnimatedCounters();
    initParallax();
    initTypingEffect();
  });

})();