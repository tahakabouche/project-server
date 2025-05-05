import "../../components/message-dialog.js";
import "../../components/confirmation-dialog.js";
import { del } from "../js/modules/api.js"

class MyUserTr extends HTMLTableRowElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <td>
             <div class="flex-div">
              <img class="table-user-pfp">
              <span class="user-name"></span>
             </div>
            </td>
            <td class="user-role" ></td>
            <td class="user-email"></td>
            <td class="user-phone"></td>
            <td class="user-last-login"></td>
            <td class="users-action-td">
               <div class="dropdown" data-dropdown>
                      <button class="dropdown-link" data-dropdown-button>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>      
                      </button>
                      <div class="dropdown-menu">
                          <ul class="dropdown-menu-options">
                            <li>
                             <a class="edit-user-btn">
                              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/></svg>
                              <span>Edit</span>
                             </a> 
                            </li>
                            <li>
                              <a class="remove-user-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg>
                                <span>Remove</span>
                              </a>
                            </li>
                          </ul>
                      </div>
                </div>    
            </td>
    `;
    // Save references to the elements for later use
    this.userName = this.querySelector(".user-name");
    this.userRole = this.querySelector(".user-role");
    this.userEmail = this.querySelector(".user-email");
    this.userPhone = this.querySelector(".user-phone");
    this.userPfp = this.querySelector(".table-user-pfp");
    this.userLastLogin = this.querySelector(".user-last-login");
    this.editUserBtn = this.querySelector(".edit-user-btn");
    this.removeUserBtn = this.querySelector(".remove-user-btn");

    // If product data was already set before connectedCallback ran
    if (this._user) {
      this._render(this._user);
    }
  }

  set data(user) {
    this._user = user;
    if (this.isConnected) {
      this._render(user);
    }
  }

  _render(user) {
    this.userPfp.src = `images/${user.profilePicture}`;
    this.userName.innerText = `${user.firstname} ${user.lastname}`;
    this.userRole.innerText = user.role;
    this.userEmail.innerText = user.email;
    this.userPhone.innerText = user.phone;
    this.editUserBtn.href = `update-user.html?id=${user._id}`;

    this.removeUserBtn.onclick = async function () {
      confirmAction(`Are you sure you want to delete this user`);
      document.addEventListener('confirmed', async () => {             
        const response = await del(`users/${user._id}`);
        if(response.success)
          showMessage('The user was deleted successfully');
        else
          showMessage('Error while trying to delete the user');
      });
    }

    this.userLastLogin.innerText = new Date(user.lastLogin).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  }
}

customElements.define("user-tr", MyUserTr, { extends: "tr" });

function showMessage(message) {
  const messageDialog = document.querySelector('message-dialog');
  messageDialog.showMessage(message);
}

function confirmAction(message) {
  const confirmationDialog = document.querySelector('confirmation-dialog');
  confirmationDialog.showMessage(message);
}