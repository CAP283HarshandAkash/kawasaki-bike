/* ══════════════════════════════════════════════════════
   CORE.JS — Shared Utilities for All Pages
   ══════════════════════════════════════════════════════ */

"use strict";

const KawasakiApp = (function () {

  /* ──────────────────────────────────────────
     DOM HELPERS
     ────────────────────────────────────────── */

  /**
   * Shorthand for querySelector
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element (default: document)
   * @returns {Element|null}
   */
  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  /**
   * Shorthand for querySelectorAll (returns real Array)
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element (default: document)
   * @returns {Element[]}
   */
  function $$(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  /**
   * Create an element with attributes and children
   * @param {string} tag - HTML tag name
   * @param {Object} attrs - Attributes object
   * @param  {...(string|Element)} children - Child elements or text
   * @returns {Element}
   */
  function createElement(tag, attrs, ...children) {
    var el = document.createElement(tag);

    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        if (key === "className") {
          el.className = attrs[key];
        } else if (key === "style" && typeof attrs[key] === "object") {
          Object.assign(el.style, attrs[key]);
        } else if (key.startsWith("on") && typeof attrs[key] === "function") {
          el.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
        } else if (key === "dataset" && typeof attrs[key] === "object") {
          Object.keys(attrs[key]).forEach(function (dataKey) {
            el.dataset[dataKey] = attrs[key][dataKey];
          });
        } else {
          el.setAttribute(key, attrs[key]);
        }
      });
    }

    children.forEach(function (child) {
      if (typeof child === "string" || typeof child === "number") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Element) {
        el.appendChild(child);
      }
    });

    return el;
  }

  /* ──────────────────────────────────────────
     STORAGE HELPERS
     ────────────────────────────────────────── */

  var STORAGE_PREFIX = "kawasaki_";

  /**
   * Save data to localStorage with prefix
   * @param {string} key
   * @param {*} value - Will be JSON.stringify'd
   */
  function saveData(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage save failed:", e);
    }
  }

  /**
   * Load data from localStorage
   * @param {string} key
   * @param {*} fallback - Default value if key not found
   * @returns {*}
   */
  function loadData(key, fallback) {
    try {
      var raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn("Storage load failed:", e);
      return fallback;
    }
  }

  /**
   * Remove data from localStorage
   * @param {string} key
   */
  function removeData(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.warn("Storage remove failed:", e);
    }
  }

  /**
   * Get all saved data as an object
   * @returns {Object}
   */
  function getAllData() {
    var data = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var fullKey = localStorage.key(i);
        if (fullKey.startsWith(STORAGE_PREFIX)) {
          var shortKey = fullKey.replace(STORAGE_PREFIX, "");
          data[shortKey] = JSON.parse(localStorage.getItem(fullKey));
        }
      }
    } catch (e) {
      console.warn("Storage read failed:", e);
    }
    return data;
  }

  /* ──────────────────────────────────────────
     EVENT HELPERS
     ────────────────────────────────────────── */

  /**
   * Debounce function — delays execution until pause in calls
   * @param {Function} fn
   * @param {number} delay - Milliseconds
   * @returns {Function}
   */
  function debounce(fn, delay) {
    var timer;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  /**
   * Throttle function — limits execution to once per interval
   * @param {Function} fn
   * @param {number} interval - Milliseconds
   * @returns {Function}
   */
  function throttle(fn, interval) {
    var lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

  /**
   * Run callback when DOM is ready
   * @param {Function} fn
   */
  function onReady(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  /* ──────────────────────────────────────────
     FORMAT HELPERS
     ────────────────────────────────────────── */

  /**
   * Format number as Indian currency
   * @param {number} amount
   * @returns {string} e.g., "₹21,00,000"
   */
  function formatCurrency(amount) {
    return "₹" + amount.toLocaleString("en-IN");
  }

  /**
   * Parse Indian currency string to number
   * @param {string} str - e.g., "₹21,00,000" or "Rs.21,00,000"
   * @returns {number}
   */
  function parseCurrency(str) {
    return parseInt(str.replace(/[₹Rs.,\s]/g, ""), 10) || 0;
  }

  /**
   * Format number with commas (Indian style)
   * @param {number} num
   * @returns {string}
   */
  function formatNumber(num) {
    return num.toLocaleString("en-IN");
  }

  /* ──────────────────────────────────────────
     ANIMATION HELPERS
     ────────────────────────────────────────── */

  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /**
   * Animate a number counting up
   * @param {Element} element - DOM element to update
   * @param {number} target - Target number
   * @param {number} duration - Animation duration in ms
   * @param {string} prefix - Text before number (e.g., "₹")
   * @param {string} suffix - Text after number (e.g., " HP")
   */
  function animateCounter(element, target, duration, prefix, suffix) {
    if (prefersReducedMotion()) {
      element.textContent = (prefix || "") + formatNumber(target) + (suffix || "");
      return;
    }

    var startTime = null;
    var startValue = 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(startValue + (target - startValue) * eased);
      element.textContent = (prefix || "") + formatNumber(current) + (suffix || "");

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  /* ──────────────────────────────────────────
     DETECTION HELPERS
     ────────────────────────────────────────── */

  /**
   * Detect current page from URL
   * @returns {string} e.g., "index", "bikes", "gallery", "contact"
   */
  function getCurrentPage() {
    var path = window.location.pathname;
    var filename = path.split("/").pop().replace(".html", "") || "index";
    return filename;
  }

  /**
   * Check if device is mobile
   * @returns {boolean}
   */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Check if device supports touch
   * @returns {boolean}
   */
  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  /* ──────────────────────────────────────────
     PUBLIC API
     ────────────────────────────────────────── */
  return {
    $: $,
    $$: $$,
    createElement: createElement,
    saveData: saveData,
    loadData: loadData,
    removeData: removeData,
    getAllData: getAllData,
    debounce: debounce,
    throttle: throttle,
    onReady: onReady,
    formatCurrency: formatCurrency,
    parseCurrency: parseCurrency,
    formatNumber: formatNumber,
    prefersReducedMotion: prefersReducedMotion,
    animateCounter: animateCounter,
    getCurrentPage: getCurrentPage,
    isMobile: isMobile,
    isTouchDevice: isTouchDevice
  };

})();