(function () {
  "use strict";


  var bikes = [
    {
      id: "ninja-zx10r",
      name: "Ninja ZX-10R",
      segment: "Sport",
      engine: "998cc inline-4",
      power: 200,
      weight: 207,
      price: 2079000,
      link: "ninja-zx10r.html",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Kawasaki_ZX10R.JPG/1280px-Kawasaki_ZX10R.JPG"
    },
    {
      id: "z900",
      name: "Z900",
      segment: "Naked",
      engine: "948cc inline-4",
      power: 125,
      weight: 212,
      price: 999000,
      link: "z900.html",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Kawasaki_Z900%2C_green.jpg/1280px-Kawasaki_Z900%2C_green.jpg"
    },
    {
      id: "versys-650",
      name: "Versys 650",
      segment: "Adventure",
      engine: "649cc parallel-twin",
      power: 67,
      weight: 216,
      price: 863000,
      link: "versys-650.html",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Kawasaki_KLE_650_Versys_Austrian_army_military_police_motorcycle_Kawasaki_%22Milit%C3%A4rstreife%22.jpg/960px-Kawasaki_KLE_650_Versys_Austrian_army_military_police_motorcycle_Kawasaki_%22Milit%C3%A4rstreife%22.jpg"
    },
    {
      id: "vulcan-s",
      name: "Vulcan S",
      segment: "Cruiser",
      engine: "649cc parallel-twin",
      power: 60,
      weight: 228,
      price: 813000,
      link: "vulcan-s.html",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Vulcan_S.jpg/1280px-Vulcan_S.jpg"
    },
    {
      id: "klr650",
      name: "KLR650",
      segment: "Dual-Sport",
      engine: "652cc single-cylinder",
      power: 40,
      weight: 207,
      price: 200000,
      link: "klr650.html",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Man_Returning_on_Kawasaki_KLR_650_-_Las_Vegas_Ride_for_Kids_2019.jpg/1280px-Man_Returning_on_Kawasaki_KLR_650_-_Las_Vegas_Ride_for_Kids_2019.jpg"
    }
  ];

  /* ──────────────────────────────────────────
     CREATE FILTER UI
     ────────────────────────────────────────── */
  function createFilterUI() {
    var segments = ["All", "Sport", "Naked", "Adventure", "Cruiser", "Dual-Sport"];

    var container = KawasakiApp.createElement("div", {
      className: "bike-filter-bar",
      id: "bikeFilterBar"
    });

    container.innerHTML = `
      <div class="filter-row">
        <!-- Search -->
        <div class="filter-search">
          <span class="filter-icon" aria-hidden="true">🔍</span>
          <input type="search" id="bikeSearch"
                 class="filter-input"
                 placeholder="Search bikes..."
                 aria-label="Search bikes by name or specification" />
        </div>

        <!-- Segment Filter -->
        <div class="filter-segments" id="segmentFilters" role="radiogroup"
             aria-label="Filter by segment">
          ${segments.map(function (seg, i) {
            return '<button class="filter-pill' + (i === 0 ? ' active' : '') +
                   '" data-segment="' + seg + '" role="radio" ' +
                   'aria-checked="' + (i === 0 ? 'true' : 'false') + '">' +
                   seg + '</button>';
          }).join("")}
        </div>

        <!-- Sort -->
        <div class="filter-sort">
          <label for="bikeSort" class="sr-only">Sort by</label>
          <select id="bikeSort" class="filter-select">
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="power-high">Power: High → Low</option>
            <option value="weight-low">Weight: Light → Heavy</option>
            <option value="name-az">Name: A → Z</option>
          </select>
        </div>
      </div>

      <!-- Results count -->
      <div class="filter-results-count" id="filterCount">
        Showing <strong>5</strong> of 5 bikes
      </div>
    `;

    return container;
  }

  /* ──────────────────────────────────────────
     FILTER LOGIC
     ────────────────────────────────────────── */
  var currentSegment = "All";
  var currentSearch  = "";
  var currentSort    = "default";

  function getFilteredBikes() {
    var results = bikes.filter(function (bike) {
      // Segment filter
      var segmentMatch = (currentSegment === "All") ||
                         (bike.segment === currentSegment);

      // Search filter
      var searchMatch = true;
      if (currentSearch.length > 0) {
        var query = currentSearch.toLowerCase();
        searchMatch = bike.name.toLowerCase().includes(query) ||
                      bike.engine.toLowerCase().includes(query) ||
                      bike.segment.toLowerCase().includes(query);
      }

      return segmentMatch && searchMatch;
    });

    // Sort
    results.sort(function (a, b) {
      switch (currentSort) {
        case "price-low":   return a.price - b.price;
        case "price-high":  return b.price - a.price;
        case "power-high":  return b.power - a.power;
        case "weight-low":  return a.weight - b.weight;
        case "name-az":     return a.name.localeCompare(b.name);
        default:            return 0;
      }
    });

    return results;
  }

  /* ──────────────────────────────────────────
     UPDATE DISPLAY
     ────────────────────────────────────────── */
  function updateBikeDisplay() {
    var filtered = getFilteredBikes();
    var modelGrid = KawasakiApp.$(".model-grid");

    if (!modelGrid) return;

    // Get all bike articles
    var articles = KawasakiApp.$$("article", modelGrid);

    articles.forEach(function (article) {
      var bikeId = null;

      // Find which bike this article represents
      bikes.forEach(function (bike) {
        var link = article.querySelector('a[href="' + bike.link + '"]');
        if (link) bikeId = bike.id;
      });

      if (!bikeId) return;

      var isVisible = filtered.some(function (b) { return b.id === bikeId; });

      if (isVisible) {
        article.style.display = "";
        article.style.opacity = "1";
        article.style.transform = "scale(1)";
      } else {
        article.style.opacity = "0";
        article.style.transform = "scale(0.95)";
        setTimeout(function () {
          if (!getFilteredBikes().some(function (b) { return b.id === bikeId; })) {
            article.style.display = "none";
          }
        }, 300);
      }
    });

    // Update count
    var countEl = KawasakiApp.$("#filterCount");
    if (countEl) {
      countEl.innerHTML = "Showing <strong>" + filtered.length +
                          "</strong> of " + bikes.length + " bikes";

      if (filtered.length === 0) {
        countEl.innerHTML += ' — <em>No bikes match your search.</em>';
      }
    }
  }

  /* ──────────────────────────────────────────
     BIND FILTER EVENTS
     ────────────────────────────────────────── */
  function bindFilterEvents() {
    // Search input
    var searchInput = KawasakiApp.$("#bikeSearch");
    if (searchInput) {
      searchInput.addEventListener("input", KawasakiApp.debounce(function () {
        currentSearch = searchInput.value.trim();
        updateBikeDisplay();
      }, 200));
    }

    // Segment pills
    var segmentContainer = KawasakiApp.$("#segmentFilters");
    if (segmentContainer) {
      segmentContainer.addEventListener("click", function (e) {
        var pill = e.target.closest(".filter-pill");
        if (!pill) return;

        // Update active state
        KawasakiApp.$$(".filter-pill", segmentContainer).forEach(function (p) {
          p.classList.remove("active");
          p.setAttribute("aria-checked", "false");
        });
        pill.classList.add("active");
        pill.setAttribute("aria-checked", "true");

        currentSegment = pill.dataset.segment;
        updateBikeDisplay();
      });
    }

    // Sort select
    var sortSelect = KawasakiApp.$("#bikeSort");
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        currentSort = sortSelect.value;
        updateBikeDisplay();
      });
    }

    // Keyboard shortcut: Ctrl+K or / to focus search
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && !e.target.matches("input, select, textarea"))) {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  /* ──────────────────────────────────────────
     INITIALIZE
     ────────────────────────────────────────── */
  KawasakiApp.onReady(function () {
    if (KawasakiApp.getCurrentPage() !== "bikes") return;

    var detailsSection = KawasakiApp.$("#details-title");
    if (!detailsSection) return;

    // Insert filter bar before model grid
    var parentCard = detailsSection.closest(".card");
    if (!parentCard) return;

    var modelGrid = parentCard.querySelector(".model-grid");
    if (!modelGrid) return;

    var filterUI = createFilterUI();
    modelGrid.parentNode.insertBefore(filterUI, modelGrid);

    // Add transition to articles
    KawasakiApp.$$("article", modelGrid).forEach(function (article) {
      article.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    });

    bindFilterEvents();
  });

})();