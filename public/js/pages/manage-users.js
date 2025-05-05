import "../../components/user-tr.js";
import "../../components/side-bar.js";
import { get } from "../modules/api.js";

const usersContainer = document.getElementById("users-container");
const mainContentContainer = document.querySelector(".dashboard-main-content");
let paginationContainer;
let pageNumber = 1;

async function getAllUsers(query) {
  try {
    if (query) {
      window.history.pushState({}, "", `/?${query}`);
    } else {
      window.history.replaceState({}, "", "/manage-users.html");
    }

    const response = await get(`users${window.location.search}`);

    usersContainer.innerHTML = "";
    if(paginationContainer) 
      paginationContainer.remove();

    const users = response.data;

    if (!users || users.length === 0) {
      alert("No users found matching your criteria.");
      return;
    }

    users.forEach((user) => {
      const userTr = document.createElement("tr", { is: "user-tr" });
      userTr.data = user;
      usersContainer.appendChild(userTr); // Add it to the DOM
    });

    addPagination(response);

  } catch (error) {
    console.error("Failed to load users:", error);
  }
};

function nextPage() {
  const params = new URLSearchParams(window.location.search);
  pageNumber = parseInt(params.get("page") || "1");
  pageNumber++;
  params.set("page", pageNumber);
  const newQueryString = params.toString();
  usersContainer.innerHTML = "";
  getAllUsers(newQueryString);
}

function prevPage() {
  const params = new URLSearchParams(window.location.search);
  pageNumber = parseInt(params.get("page") || "1");
  if (pageNumber > 1) {
    pageNumber--;
    params.set("page", pageNumber);
    const newQueryString = params.toString();
    usersContainer.innerHTML = "";
    getAllUsers(newQueryString);
  }
}

function addPagination(response){
  paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination-container");
  paginationContainer.innerHTML = `
              <button class="pagination-btn btn " id="prev-page-btn">
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
                <p>Prev</p>
              </button>
              <button class="pagination-btn btn" id="next-page-btn">
                <p>Next</p>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
              </button>
  `;
  mainContentContainer.appendChild(paginationContainer);

  const nextPageBtn = document.getElementById("next-page-btn");
  const prevPageBtn = document.getElementById("prev-page-btn");

  if (!response.pagination || !response.pagination.next) {
    nextPageBtn.style.visibility = "hidden";
  } else {
    nextPageBtn.addEventListener("click", nextPage);
  }

  if (!response.pagination || !response.pagination.prev || pageNumber <= 1) {
    prevPageBtn.style.visibility = "hidden";
  } else {
    prevPageBtn.addEventListener("click", prevPage);
  }
}

getAllUsers();

document.addEventListener("click", (e) => {
  // Check if the clicked element or any of its parents is a dropdown button
  const dropdownButton = e.target.closest("[data-dropdown-button]");
  const isDropdownButton = dropdownButton !== null;
  
  // If clicked inside a dropdown but not on a button, don't do anything
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return;
  
  let currentDropdown;
  if (isDropdownButton) {
      currentDropdown = dropdownButton.closest("[data-dropdown]");
      currentDropdown.classList.toggle("active");
  }
  
  // Close other dropdowns
  document.querySelectorAll("[data-dropdown].active").forEach((dropdown) => {
      if (dropdown === currentDropdown) return;
      dropdown.classList.remove("active");
  });
});