class ConfirmationDialog extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
      <dialog>
      <div class="message-dialog">
        <div class="flex-sub-div">
          <p style="font-size: 2rem; font-weight: 600;">Message</p>
          <button class="close-dialog-x">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path
              d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
            />
          </svg></button> 
        </div>
        <p class="dialog-message"></p>
        <div style="align-self: end; margin-top: .75rem;" class="flex-row-div">
            <button class="btn-square confirm-dialog-btn" type="button">
            Confirm
            </button>
            <button class="btn-square-secondary cancel-dialog-btn" type="button">
            Cancel
            </button>
        </div>
      </div>
    </dialog>
    `;
     
        this.dialogElem = this.querySelector("dialog");
        this.dialogMessage = this.querySelector(".dialog-message");
        this.cancelBtn = this.querySelector(".cancel-dialog-btn");
        this.closeX = this.querySelector(".close-dialog-x");
        this.confirmBtn = this.querySelector(".confirm-dialog-btn");

        this.cancelBtn.addEventListener("click", () => this.dialogElem.close());
        this.closeX.addEventListener("click", () => this.dialogElem.close());
        this.confirmBtn.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent("confirmed", {
                detail: { },
                bubbles: true,
                composed: true,
                })
            );
            this.dialogElem.close();
        });
      
    }
  
    showMessage(message){
        this.dialogElem.showModal();
        this.dialogMessage.innerText = message;
    }
    
  }
  
  customElements.define("confirmation-dialog", ConfirmationDialog);