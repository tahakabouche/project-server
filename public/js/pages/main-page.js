import "../../components/header.js";
import "../../components/filter.js";
import "../../components/product-card.js";

import { get } from "../modules/api.js";

// Define constants for URLs
const BASE_URL = "http://localhost:5000";
const IMAGE_URL = `${BASE_URL}/images`;

const container = document.querySelector(".product-list-container");
const errorContainer = document.createElement("div");
errorContainer.className = "error-container";
errorContainer.style.display = "none";
container.parentElement.insertBefore(errorContainer, container);

const backdrop = document.querySelector('.backdrop');


let pageNumber = 1;
let limit = 20;
let paginationContainer;

// Check if window.chosenSizes exists, if not initialize it
if (!window.chosenSizes || !Array.isArray(window.chosenSizes)) {
  window.chosenSizes = [];
}

// Filtering inputs
const minPriceFilter = document.getElementById("min-price");
const maxPriceFilter = document.getElementById("max-price");
const applyFilterBtn = document.getElementById("apply-filter-btn");
const categoryFilters = document.querySelectorAll(".product-category-filter");
const filterMenuBtn = document.querySelector('.filter-menu-btn');
const closeFilterMenuBtn = document.querySelector('.close-filter-menu-btn');

filterMenuBtn.addEventListener('click', showFilterMenu);
closeFilterMenuBtn.addEventListener('click', hideFilterMenu);

function showFilterMenu(){
  const filterMenu = document.querySelector('.menu-filter-container');
  filterMenu.style.display = 'flex';
  backdrop.classList.toggle('active');
}

function hideFilterMenu(){
  const filterMenu = document.querySelector('.menu-filter-container');
  backdrop.classList.toggle('active');
  filterMenu.style.display = 'none';
}

applyFilterBtn.addEventListener("click", applyFilters);

function showError(message) {
  errorContainer.style.display = "block";
  errorContainer.innerHTML = `<p class="error-message">${message}</p>`;
}

function hideError() {
  errorContainer.style.display = "none";
}

function applyFilters() {
  // Check if the window.chosenSizes exists before trying to map it
  let chosenSizesValues = [];
  if (window.chosenSizes && Array.isArray(window.chosenSizes)) {
    chosenSizesValues = window.chosenSizes.map(
      (element) => element.dataset.value
    );
  }

  const params = new URLSearchParams();

  categoryFilters.forEach((element) => {
    if (element.checked) params.append("category", element.dataset.value);
  });

  if (chosenSizesValues.length > 0) {
    params.append("size", chosenSizesValues.join(","));
  }

  if (minPriceFilter.value) {
    params.set("price[gte]", minPriceFilter.value);
  }

  if (maxPriceFilter.value) {
    params.set("price[lte]", maxPriceFilter.value);
  }

  const newQueryString = params.toString();

  container.innerHTML = "";
  hideError();

  window.history.replaceState({}, "", "/");
  getAllProducts(newQueryString);
}

function nextPage() {
  const params = new URLSearchParams(window.location.search);
  pageNumber = parseInt(params.get("page") || "1");
  pageNumber++;
  params.set("page", pageNumber);
  const newQueryString = params.toString();
  container.innerHTML = "";
  hideError();
  getAllProducts(newQueryString);
}

function prevPage() {
  const params = new URLSearchParams(window.location.search);
  pageNumber = parseInt(params.get("page") || "1");
  if (pageNumber > 1) {
    pageNumber--;
    params.set("page", pageNumber);
    const newQueryString = params.toString();
    container.innerHTML = "";
    hideError();
    getAllProducts(newQueryString);
  }
}

const getAllProducts = async (query) => {
  try {
    if (query) {
      window.history.pushState({}, "", `/?${query}`);
    } else {
      const query = window.location.search;
      window.history.replaceState({}, '', '/index.html' + query);
    }

    // Show loading indicator
    container.innerHTML = '<div class="loading">Loading products...</div>';

    const response = await get(`products${window.location.search}`);

    addDocumentationInfo(response);

    // Clear the container before adding new content
    container.innerHTML = "";
    if(paginationContainer) 
      paginationContainer.remove();

    const products = response.data;

    if (!products || products.length === 0) {
      container.innerHTML =
        '<div class="no-products">No products found matching your criteria.</div>';
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("a");
      card.href = `/product-detail.html?id=${product._id}`;
      card.innerHTML = `
            <div class="product-card">
            <div class="image-wrapper">
              <img class="product-card__image" src="${IMAGE_URL}/${product.images[0]}" alt="${product.name}" />
            </div>
            <div class="product-card__content">
             <h3 class="product-card__name">${product.name}</h3>
             <h2 class="product-card__price">${product.price.toLocaleString('en-US')}DA</h2>
            </div> 
            </div> 
          `;
      container.appendChild(card); // Add it to the DOM
    });

    addPagination(response);
  } catch (error) {
    console.error("Failed to load products:", error);
    showError(`Failed to load products: ${error.message || "Unknown error"}`);
  }
};

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
  container.appendChild(paginationContainer);

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

// Initialize the page
getAllProducts();

function addDocumentationInfo(response){
  const firstDoc = document.querySelector('.first-doc');
  const lastDoc = document.querySelector('.last-doc');
  const docCount = document.querySelector('.doc-count');

  const firstDocument = (pageNumber - 1)*limit + 1;
  const totalDocumnets = response.total;
  const lastDocument = (totalDocumnets - firstDocument > limit) ? pageNumber*limit : totalDocumnets;

  firstDoc.innerText = `${firstDocument}`;
  lastDoc.innerText = `${lastDocument}`;
  docCount.innerText = totalDocumnets;
}
// Track the currently open dropdown
let currentOpenDropdown = null;

// Add event listener for the entire document
document.addEventListener("mouseover", function(e) {
    // Check if we're hovering over the dropdown or any of its children
    const dropdown = e.target.closest(".dropdown");
    
    if (dropdown) {
        // We're inside a dropdown (either the button or menu)
        if (currentOpenDropdown !== dropdown) {
            // If there was a different dropdown open, close it
            if (currentOpenDropdown) {
                closeDropdown(currentOpenDropdown);
            }
            
            // Open this dropdown
            openDropdown(dropdown);
            currentOpenDropdown = dropdown;
        }
    } else if (currentOpenDropdown) {
        // We're not in any dropdown, close the current one
        closeDropdown(currentOpenDropdown);
        currentOpenDropdown = null;
    }
});

// Helper function to open a dropdown
function openDropdown(dropdown) {
    // Add active class to the dropdown
    dropdown.classList.add("active");
    
    // Rotate the SVG arrow
    const svg = dropdown.querySelector(".dropdown-link svg");
    if (svg) {
        svg.style.transform = "rotate(180deg)";
        svg.style.transition = "transform 0.2s ease";
    }
}

// Helper function to close a dropdown
function closeDropdown(dropdown) {
    // Remove active class from the dropdown
    dropdown.classList.remove("active");
    
    // Reset the SVG arrow rotation
    const svg = dropdown.querySelector(".dropdown-link svg");
    if (svg) {
        svg.style.transform = "rotate(0deg)";
    }
}
