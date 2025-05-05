class StateDropDownMenu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
          <div class="state-dropdown-container">
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
                        <div class="dropdown-option" data-value="Adrar">Adrar</div>
                        <div class="dropdown-option" data-value="Chlef">Chlef</div>
                        <div class="dropdown-option" data-value="Laghouat">Laghouat</div>
                        <div class="dropdown-option" data-value="Oum El Bouaghi">Oum El Bouaghi</div>
                        <div class="dropdown-option" data-value="Batna">Batna</div>
                        <div class="dropdown-option" data-value="Béjaïa">Béjaïa</div>
                        <div class="dropdown-option" data-value="Biskra">Biskra</div>
                        <div class="dropdown-option" data-value="Béchar">Béchar</div>
                        <div class="dropdown-option" data-value="Blida">Blida</div>
                        <div class="dropdown-option" data-value="Bouira">Bouira</div>
                        <div class="dropdown-option" data-value="Tamanrasset">Tamanrasset</div>
                        <div class="dropdown-option" data-value="Tébessa">Tébessa</div>
                        <div class="dropdown-option" data-value="Tlemcen">Tlemcen</div>
                        <div class="dropdown-option" data-value="Tiaret">Tiaret</div>
                        <div class="dropdown-option" data-value="Tizi Ouzou">Tizi Ouzou</div>
                        <div class="dropdown-option" data-value="Alger">Alger</div>
                        <div class="dropdown-option" data-value="Djelfa">Djelfa</div>
                        <div class="dropdown-option" data-value="Jijel">Jijel</div>
                        <div class="dropdown-option" data-value="Sétif">Sétif</div>
                        <div class="dropdown-option" data-value="Saïda">Saïda</div>
                        <div class="dropdown-option" data-value="Skikda">Skikda</div>
                        <div class="dropdown-option" data-value="Sidi Bel Abbès">Sidi Bel Abbès</div>
                        <div class="dropdown-option" data-value="Annaba">Annaba</div>
                        <div class="dropdown-option" data-value="Guelma">Guelma</div>
                        <div class="dropdown-option" data-value="Constantine">Constantine</div>
                        <div class="dropdown-option" data-value="Médéa">Médéa</div>
                        <div class="dropdown-option" data-value="Mostaganem">Mostaganem</div>
                        <div class="dropdown-option" data-value="M'Sila">M'Sila</div>
                        <div class="dropdown-option" data-value="Mascara">Mascara</div>
                        <div class="dropdown-option" data-value="Ouargla">Ouargla</div>
                        <div class="dropdown-option" data-value="Oran">Oran</div>
                        <div class="dropdown-option" data-value="El Bayadh">El Bayadh</div>
                        <div class="dropdown-option" data-value="Illizi">Illizi</div>
                        <div class="dropdown-option" data-value="Bordj Bou Arreridj">Bordj Bou Arreridj</div>
                        <div class="dropdown-option" data-value="Boumerdès">Boumerdès</div>
                        <div class="dropdown-option" data-value="El Tarf">El Tarf</div>
                        <div class="dropdown-option" data-value="Tindouf">Tindouf</div>
                        <div class="dropdown-option" data-value="Tissemsilt">Tissemsilt</div>
                        <div class="dropdown-option" data-value="El Oued">El Oued</div>
                        <div class="dropdown-option" data-value="Khenchela">Khenchela</div>
                        <div class="dropdown-option" data-value="Souk Ahras">Souk Ahras</div>
                        <div class="dropdown-option" data-value="Tipaza">Tipaza</div>
                        <div class="dropdown-option" data-value="Mila">Mila</div>
                        <div class="dropdown-option" data-value="Aïn Defla">Aïn Defla</div>
                        <div class="dropdown-option" data-value="Naâma">Naâma</div>
                        <div class="dropdown-option" data-value="Aïn Témouchent">Aïn Témouchent</div>
                        <div class="dropdown-option" data-value="Ghardaïa">Ghardaïa</div>
                        <div class="dropdown-option" data-value="Relizane">Relizane</div>
                        <div class="dropdown-option" data-value="Timimoun">Timimoun</div>
                        <div class="dropdown-option" data-value="Bordj Badji Mokhtar">Bordj Badji Mokhtar</div>
                        <div class="dropdown-option" data-value="Ouled Djellal">Ouled Djellal</div>
                        <div class="dropdown-option" data-value="Béni Abbès">Béni Abbès</div>
                        <div class="dropdown-option" data-value="In Salah">In Salah</div>
                        <div class="dropdown-option" data-value="In Guezzam">In Guezzam</div>
                        <div class="dropdown-option" data-value="Touggourt">Touggourt</div>
                        <div class="dropdown-option" data-value="Djanet">Djanet</div>
                        <div class="dropdown-option" data-value="El M'Ghair">El M'Ghair</div>
                        <div class="dropdown-option" data-value="El Meniaa">El Meniaa</div>            
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
      if (!event.target.closest(".state-dropdown-container")) {
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

    const myEvent = new CustomEvent("stateChanged", {
      detail: {
        state: newValue 
      }
    });
    
    document.dispatchEvent(myEvent);
  }

  get selected() {
    return this.getAttribute("selected");
  }

  set selected(val) {
    this.setAttribute("selected", val);
  }
}

customElements.define("state-dropdown-menu", StateDropDownMenu);
