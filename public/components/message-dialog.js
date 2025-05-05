class MessageDialog extends HTMLElement {
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
        <button class="btn-square close-dialog-btn" type="button">
          Continue
        </button>
      </div>
    </dialog>
    `;
     
        this.dialogElem = this.querySelector("dialog");
        this.dialogMessage = this.querySelector(".dialog-message");
        this.closeDialogBtn = this.querySelector(".close-dialog-btn");
        this.closeDialogX = this.querySelector(".close-dialog-x");

        this.closeDialogBtn.addEventListener("click", () => this.dialogElem.close());
        this.closeDialogX.addEventListener("click", () => this.dialogElem.close());
      
    }
  
    showMessage(message){
        this.dialogElem.showModal();
        this.dialogMessage.innerText = message;
    }
    
  }
  
  customElements.define("message-dialog", MessageDialog);