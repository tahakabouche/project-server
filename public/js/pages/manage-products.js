import "../../components/product-card.js";
import "../../components/side-bar.js";
import { get } from "../modules/api.js";

const filterDialog = document.getElementById("filter-dialog");
const filterBtn = document.getElementById("filter-dashboard-btn");

filterBtn.addEventListener("click", filterDialog.showModal);

let paginationContainer;

const container = document.querySelector(".product-list-container");
const errorContainer = document.createElement("div");
errorContainer.className = "error-container";
errorContainer.style.display = "none";
container.parentElement.insertBefore(errorContainer, container);

const params = new URLSearchParams(window.location.search);
let pageNumber = parseInt(params.get("page") || "1");
let limit = 20;

const getAllProducts = async (query) => {
  try {
    if (query) {
      window.history.pushState({}, "", `/?${query}`);
    } else {
      window.history.replaceState({}, "", "/manage-products.html");
    }
    // Show loading indicator
    container.innerHTML = '<div class="loading">Loading products...</div>';

    const response = await get(`products${window.location.search}`);

    const params = new URLSearchParams(window.location.search);
    let pageNumber = parseInt(params.get("page") || "1");
    addDocumentationInfo(response, pageNumber);

    container.innerHTML = "";

    const products = response.data;

    if (!products || products.length === 0) {
      container.innerHTML =
        '<div class="no-products">No products found matching your criteria.</div>';
      return;
    }

    products.forEach((product) => {
      const card = document.createElement("product-card");
      card.data = product;
      container.appendChild(card); // Add it to the DOM
    });

    if (paginationContainer) paginationContainer.remove();

    addPagination(response);
  } catch (error) {
    console.error("Failed to load products:", error);
    showError(`Failed to load products: ${error.message || "Unknown error"}`);
  }
};

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

function hideError() {
  errorContainer.style.display = "none";
}

function addPagination(response) {
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

getAllProducts();

function addDocumentationInfo(response, pageNumber) {
  const firstDoc = document.querySelector(".first-doc");
  const lastDoc = document.querySelector(".last-doc");
  const docCount = document.querySelector(".doc-count");

  const firstDocument = (pageNumber - 1) * limit + 1;
  const totalDocuments = response.total;
  const lastDocument = Math.min(
    pageNumber * limit,
    firstDocument + response.count - 1
  );
  console.log(
    "total document: " + totalDocuments + " last doc: " + lastDocument
  );

  firstDoc.innerText = `${firstDocument}`;
  lastDoc.innerText = `${lastDocument}`;
  docCount.innerText = `${totalDocuments}`;
}
