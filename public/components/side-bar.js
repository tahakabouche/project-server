import { isAuthenticated, logout, getUserData } from "../js/modules/auth.js";

class MySideBar extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <aside id="sidebar">
      <ul>
        <li>
          <a href="/" class="dashbord-logo"><h1>Taha</h1></a>
          <button id="side-bar-toggle-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path
                d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
              />
            </svg>
          </button>
        </li>

        <li>
          <a href="personal-info.html"
             id="personal-info-a"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path
                d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"
              /></svg
            ><span>Personal Information</span></a
          >
        </li>
        <li>
          <a href="manage-products.html" 
             id="manage-products-a"
              ><svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path
                d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"
              /></svg
            ><span>Products</span></a
          >
        </li>
        <li>
          <a href="manage-orders.html"
            id="manage-orders-a"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path
                d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"
              /></svg
            ><span>Orders</span></a
          >
        </li>
        <li>
          <a href="manage-users.html"
             id="manage-users-a"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path
                d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"
              /></svg
            ><span>Users</span></a
          >
        </li>
        <li>
          <a href="manage-shipping.html"
             id="manage-shipping-a"
            ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 120q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120ZM360-540Z"/></svg>
            <span>Shipping</span></a
          >
        </li>
        <li>
         
            <button id="logout-btn">
              <a
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
                  /></svg
                ><span>Logout</span></a>
            </button>  
        </li>
      </ul>
    </aside>
      `;
  }

  connectedCallback() {
    // Save references to the elements for later use
    this.manageUsersLink = this.querySelector("#manage-users-a");
    this.manageProductsLink = this.querySelector("#manage-products-a");
    this.manageOrdersLink = this.querySelector("#manage-orders-a");
    this.personalInfoLink = this.querySelector("#personal-info-a");
    this.manageShippingLink = this.querySelector("#manage-shipping-a");
    this.sideBarToggleBtn = document.querySelector("#side-bar-toggle-btn");
    this.sideBar = document.querySelector("#sidebar");
    this.logoutBtn = document.querySelector("#logout-btn");

    this.logoutBtn.addEventListener("click", logout);

    this.sideBarToggleBtn.addEventListener("click", () => this.toggleSideBar());

    this._render();
  }

  _render() {
    this.removeUnauthorizedLinks();

    if (window.location.pathname === "/personal-info.html")
      this.personalInfoLink.classList.add("active");

    if (window.location.pathname === "/manage-products.html")
      this.manageProductsLink.classList.add("active");

    if (window.location.pathname === "/add-product.html")
      this.manageProductsLink.classList.add("active");

    if (window.location.pathname === "/update-product.html")
      this.manageProductsLink.classList.add("active");

    if (window.location.pathname === "/manage-orders.html")
      this.manageOrdersLink.classList.add("active");

    if (window.location.pathname === "/manage-users.html")
      this.manageUsersLink.classList.add("active");

    if (window.location.pathname === "/update-user.html")
      this.manageUsersLink.classList.add("active");

    if (window.location.pathname === "/manage-shipping.html")
      this.manageShippingLink.classList.add("active");
  }

  removeUnauthorizedLinks() {
    const user = getUserData();
    console.log(user);
    if (isAuthenticated()) {
      if (user.role !== "admin") {
        this.manageOrdersLink.remove();
        this.manageProductsLink.remove();
        this.manageUsersLink.remove();
        this.manageShippingLink.remove();
      }
    } 
  }

  toggleSideBar() {
    this.sideBar.classList.toggle("close");
  }
}

customElements.define("side-bar", MySideBar);
