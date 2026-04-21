(function () {
  "use strict";


  function calculateEMI(principal, annualRate, months) {
    if (principal <= 0 || annualRate <= 0 || months <= 0) return 0;

    var monthlyRate = annualRate / 12 / 100;
    var factor = Math.pow(1 + monthlyRate, months);
    var emi = (principal * monthlyRate * factor) / (factor - 1);

    return Math.round(emi);
  }

  function calculateBreakdown(principal, annualRate, months) {
    var emi = calculateEMI(principal, annualRate, months);
    var totalPayment = emi * months;
    var totalInterest = totalPayment - principal;

    return {
      emi: emi,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      principal: principal,
      months: months,
      annualRate: annualRate
    };
  }



  function createCalculatorUI() {

    var container = KawasakiApp.createElement("section", {
      className: "card emi-calculator-section",
      style: { marginTop: "16px" },
      id: "emiCalculator"
    });

    container.innerHTML = `
      <h2 style="margin: 0 0 6px; font-size: 20px;">💰 EMI Calculator</h2>
      <p class="muted" style="margin-bottom: 16px;">
        Calculate your monthly installment for any Kawasaki bike.
      </p>

      <div class="emi-grid">
        <!-- Inputs -->
        <div class="emi-inputs">
          <!-- Bike Selector -->
          <div class="emi-field">
            <label for="emiBike">Select Bike:</label>
            <select id="emiBike" class="emi-select">
              <option value="2079000">Ninja ZX-10R (₹20,79,000)</option>
              <option value="999000">Z900 (₹9,99,000)</option>
              <option value="863000">Versys 650 (₹8,63,000)</option>
              <option value="813000">Vulcan S (₹8,13,000)</option>
              <option value="200000">KLR650 (₹2,00,000)</option>
              <option value="custom">Custom Amount</option>
            </select>
          </div>

          <!-- Custom Amount (hidden by default) -->
          <div class="emi-field" id="customAmountField" style="display: none;">
            <label for="emiCustomAmount">Loan Amount (₹):</label>
            <input type="number" id="emiCustomAmount" class="emi-input"
                   min="50000" max="50000000" step="10000"
                   placeholder="Enter amount" />
          </div>

          <!-- Down Payment -->
          <div class="emi-field">
            <label for="emiDown">
              Down Payment: <strong id="downLabel">20%</strong>
            </label>
            <input type="range" id="emiDown" class="emi-slider"
                   min="0" max="90" value="20" step="5" />
            <span class="emi-range-info">
              ₹<span id="downAmount">4,15,800</span>
            </span>
          </div>

          <!-- Interest Rate -->
          <div class="emi-field">
            <label for="emiRate">
              Interest Rate: <strong id="rateLabel">9.5%</strong> p.a.
            </label>
            <input type="range" id="emiRate" class="emi-slider"
                   min="5" max="20" value="9.5" step="0.25" />
          </div>

          <!-- Tenure -->
          <div class="emi-field">
            <label for="emiTenure">
              Tenure: <strong id="tenureLabel">36</strong> months
            </label>
            <input type="range" id="emiTenure" class="emi-slider"
                   min="6" max="84" value="36" step="6" />
            <span class="emi-range-info">
              (<span id="tenureYears">3</span> years)
            </span>
          </div>
        </div>

        <!-- Results -->
        <div class="emi-results" id="emiResults">
          <div class="emi-result-card emi-main">
            <span class="emi-result-label">Monthly EMI</span>
            <span class="emi-result-value" id="emiValue">—</span>
          </div>
          <div class="emi-result-card">
            <span class="emi-result-label">Loan Amount</span>
            <span class="emi-result-value" id="loanValue">—</span>
          </div>
          <div class="emi-result-card">
            <span class="emi-result-label">Total Interest</span>
            <span class="emi-result-value" id="interestValue">—</span>
          </div>
          <div class="emi-result-card">
            <span class="emi-result-label">Total Payment</span>
            <span class="emi-result-value" id="totalValue">—</span>
          </div>

          <!-- Visual Breakdown Bar -->
          <div class="emi-breakdown">
            <div class="emi-bar">
              <div class="emi-bar-principal" id="barPrincipal"
                   style="width: 70%"></div>
              <div class="emi-bar-interest" id="barInterest"
                   style="width: 30%"></div>
            </div>
            <div class="emi-bar-labels">
              <span>🟢 Principal: <span id="principalPercent">70</span>%</span>
              <span>🔴 Interest: <span id="interestPercent">30</span>%</span>
            </div>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  /* ──────────────────────────────────────────
     BIND CALCULATOR EVENTS
     ────────────────────────────────────────── */

  function bindCalculatorEvents() {
    var bikeSelect    = KawasakiApp.$("#emiBike");
    var customField   = KawasakiApp.$("#customAmountField");
    var customInput   = KawasakiApp.$("#emiCustomAmount");
    var downSlider    = KawasakiApp.$("#emiDown");
    var rateSlider    = KawasakiApp.$("#emiRate");
    var tenureSlider  = KawasakiApp.$("#emiTenure");

    if (!bikeSelect) return;

    function getValues() {
      var bikePrice;
      if (bikeSelect.value === "custom") {
        bikePrice = parseInt(customInput.value, 10) || 0;
      } else {
        bikePrice = parseInt(bikeSelect.value, 10);
      }

      var downPercent = parseFloat(downSlider.value);
      var rate        = parseFloat(rateSlider.value);
      var months      = parseInt(tenureSlider.value, 10);
      var downPayment = Math.round(bikePrice * downPercent / 100);
      var loanAmount  = bikePrice - downPayment;

      return {
        bikePrice: bikePrice,
        downPercent: downPercent,
        downPayment: downPayment,
        loanAmount: loanAmount,
        rate: rate,
        months: months
      };
    }

    function updateResults() {
      var vals = getValues();

      // Update labels
      KawasakiApp.$("#downLabel").textContent  = vals.downPercent + "%";
      KawasakiApp.$("#downAmount").textContent  = KawasakiApp.formatNumber(vals.downPayment);
      KawasakiApp.$("#rateLabel").textContent   = vals.rate + "%";
      KawasakiApp.$("#tenureLabel").textContent = vals.months;
      KawasakiApp.$("#tenureYears").textContent = (vals.months / 12).toFixed(1);

      if (vals.loanAmount <= 0) {
        KawasakiApp.$("#emiValue").textContent     = "₹0";
        KawasakiApp.$("#loanValue").textContent    = "₹0";
        KawasakiApp.$("#interestValue").textContent = "₹0";
        KawasakiApp.$("#totalValue").textContent    = KawasakiApp.formatCurrency(vals.bikePrice);
        return;
      }

      var result = calculateBreakdown(vals.loanAmount, vals.rate, vals.months);

      // Animate the EMI counter
      KawasakiApp.animateCounter(
        KawasakiApp.$("#emiValue"), result.emi, 400, "₹", "/mo"
      );

      KawasakiApp.$("#loanValue").textContent     = KawasakiApp.formatCurrency(result.principal);
      KawasakiApp.$("#interestValue").textContent  = KawasakiApp.formatCurrency(result.totalInterest);
      KawasakiApp.$("#totalValue").textContent     = KawasakiApp.formatCurrency(result.totalPayment);

      // Update breakdown bar
      var principalPct = Math.round((result.principal / result.totalPayment) * 100);
      var interestPct  = 100 - principalPct;

      KawasakiApp.$("#barPrincipal").style.width     = principalPct + "%";
      KawasakiApp.$("#barInterest").style.width      = interestPct + "%";
      KawasakiApp.$("#principalPercent").textContent  = principalPct;
      KawasakiApp.$("#interestPercent").textContent   = interestPct;
    }

    // Show/hide custom amount field
    bikeSelect.addEventListener("change", function () {
      customField.style.display = bikeSelect.value === "custom" ? "block" : "none";
      updateResults();
    });

    // Debounced update for sliders
    var debouncedUpdate = KawasakiApp.debounce(updateResults, 50);

    customInput.addEventListener("input", debouncedUpdate);
    downSlider.addEventListener("input", debouncedUpdate);
    rateSlider.addEventListener("input", debouncedUpdate);
    tenureSlider.addEventListener("input", debouncedUpdate);

    // Initial calculation
    updateResults();
  }

  /* ──────────────────────────────────────────
     INITIALIZE
     ────────────────────────────────────────── */

  KawasakiApp.onReady(function () {
    // Only load on bikes.html
    if (KawasakiApp.getCurrentPage() !== "bikes") return;

    // Find insertion point (after model highlights)
    var mainContainer = KawasakiApp.$("main.container") || KawasakiApp.$("main");
    if (!mainContainer) return;

    var calculatorUI = createCalculatorUI();
    mainContainer.appendChild(calculatorUI);
    bindCalculatorEvents();
  });

})();