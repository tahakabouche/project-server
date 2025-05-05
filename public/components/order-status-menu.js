class OrderStatusMenu extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `
            <div class="status-dropdown-container">
                  <div class="dropdown-select">
                    <span class="dropdown-select-text">Select an option</span>
                    <svg
                      class="dropdown-select-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="black"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div class="dropdown-options">
                        <div class="dropdown-option" data-value="Processing">Processing</div>
                        <div class="dropdown-option" data-value="Shipped">Shipped</div>       
                        <div class="dropdown-option" data-value="Delivered">Delivered</div>       
                        <div class="dropdown-option" data-value="Failed">Failed</div>       
                  </div>
                </div>
         `;
    }
  
    connectedCallback() {
      this.dropdownSelect = this.querySelector(".dropdown-select");
      this.dropdownOptions = this.querySelector(".dropdown-options");
      this.dropdownSelectText = this.querySelector(".dropdown-select-text");
      this.options = this.querySelectorAll(".dropdown-option");
  
      this.dropdownSelect.addEventListener("click", () => {
        this.dropdownSelect.classList.toggle("active");
        this.dropdownOptions.classList.toggle("show");
      });
  
      document.addEventListener("click", (event) => {
        if (!event.target.closest(".status-dropdown-container")) {
          this.dropdownSelect.classList.remove("active");
          this.dropdownOptions.classList.remove("show");
        }
      });
  
      this.options.forEach((option) => {
        option.addEventListener("click", () => this.updateSelectedOption(option));
      });
    }
  
    updateSelectedOption(option) {
      // Remove selected class from all options
      this.options.forEach((opt) => opt.classList.remove("selected"));
  
      // Add selected class to clicked option
      option.classList.add("selected");
  
      // Update dropdown text
      this.dropdownSelectText.textContent = option.textContent;
  
      // Get selected value
      this.setAttribute("selected", option.getAttribute("data-value"));
  
      // Close dropdown
      this.dropdownSelect.classList.remove("active");
      this.dropdownOptions.classList.remove("show");
    }
  
    static get observedAttributes() {
      return ["selected"];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {

        const option = this.querySelector(`[data-value="${newValue}"]`);
        // if the new selected value is invalid or null remove the selected class from all options
        if (!option) {
          this.options.forEach((option) => option.classList.remove("selected"));
          this.dropdownSelectText.textContent = "Select an Option";
        }
    
        this.dropdownSelectText.textContent = option.textContent;
        option.classList.add("selected");
    }
  
    get selected() {
      return this.getAttribute("selected");
    }
  
    set selected(val) {
      this.setAttribute("selected", val);
    }
  }
  
  customElements.define("order-status-menu", OrderStatusMenu);
  