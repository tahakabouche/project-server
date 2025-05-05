import "../../components/header.js";
import "../../components/product-order.js";
import "../../components/image-slider.js";
import "../../components/message-dialog.js";
import "../../components/shoe-size-menu.js";

import { post, get } from "../modules/api.js";
import { setCart, getCart } from "../modules/utils.js";
import { isAuthenticated } from "../modules/auth.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let chosenSize = null;
let clickedSizes = [];
window.availableSizes = [];


const addToCartBtn = document.querySelector("#add-to-cart-btn");

const imageSlider = document.querySelector("image-slider");
const productOrderElem = document.querySelector("product-order");

const plusBtn = document.querySelector(".pbtn");
const minusBtn = document.querySelector(".mbtn");
const header = document.querySelector("my-header");
let quantityValueElement = document.getElementById("quantity-value");

// quantity always gets initialized to 1
quantityValueElement.value = 1;

plusBtn.addEventListener("click", incrementProductQuantity);
minusBtn.addEventListener("click", decrementProductQuantity);


window.updateCloathingChosenSize = function (element) {

  // If not already clicked and no sizes are chosen
  if (
    !element.classList.contains("btn--filter-clicked") &&
    clickedSizes.length === 0
  ) {
    element.classList.add("btn--filter-clicked");
    element.classList.add("btn--black-hov");
    element.classList.remove("btn--gray-hov");
    clickedSizes.push(element);
    chosenSize = element.dataset.value;
  }
  // If not already clicked but other sizes are chosen
  else if (
    !element.classList.contains("btn--filter-clicked") &&
    clickedSizes.length > 0
  ) {
    // Remove classes from previously clicked elements
    clickedSizes.forEach((elem) => {
      elem.classList.remove("btn--filter-clicked");
      elem.classList.remove("btn--black-hov");
      elem.classList.add("btn--gray-hov");
    });

    // Clear the array and add the current element
    clickedSizes = [element];

    // Add classes to current element
    element.classList.add("btn--filter-clicked");
    element.classList.add("btn--black-hov");
    element.classList.remove("btn--gray-hov");
    chosenSize = element.dataset.value;
  }
  // If already clicked, unselect it
  else {
    element.classList.remove("btn--filter-clicked");
    element.classList.add("btn--gray-hov");
    element.classList.remove("btn--black-hov");
    clickedSizes = [];
    chosenSize = null;
  }
  console.log(chosenSize);
}

window.updateShoeChosenSize = function(element){
 chosenSize = element.dataset.value;
 console.log(chosenSize); 
}

function incrementProductQuantity() {
  if (quantityValueElement.value < 99) {
    quantityValueElement.value++;
  }
}

function decrementProductQuantity() {
  if (quantityValueElement.value > 1) {
    quantityValueElement.value--;
  }
}

async function populateProductInfo() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    // Check if ID is provided
    if (!productId) {
      showMessage("Product ID is missing");
      return;
    }

    const response = await get(`/products/${productId}`);

    productOrderElem.data = response.data;
    let images = response.data.images;

    // Update images
    for (let i = 0; i < images.length; i++) {
      let imageSlide = document.createElement("img");
      imageSlide.src = `images/${images[i]}`;
      imageSlider.appendChild(imageSlide);
    }
  } catch (error) {
    console.error("Error loading product:", error);
    showMessage(`Error loading product: ${error.message}`);
  }
}

window.addToCart = async () => {
  try {
    // Check if size is selected
    if (!chosenSize) {
      showMessage("Please select a size");
      return;
    }

    // Disable button to prevent multiple clicks
    addToCartBtn.disabled = true;
    addToCartBtn.textContent = "Adding...";

    // Check if user is authenticated
    if (!isAuthenticated()) {
      const cart = getCart();
      const response = await get(`/products/${productId}`);

      //checks if a product already exists in cart and has the same chosen size as the current request
      const cartItem = cart.find(
        (item) => item.product._id === productId && item.size === chosenSize
      );

      if (cartItem) {
        cartItem.quantity += parseInt(quantityValueElement.value);
      } else {
        cart.push({
          product: response.data,
          quantity: parseInt(quantityValueElement.value),
          size: chosenSize,
        });
      }

      setCart(cart);
      showMessage("Item added to cart successfully!");
      header.updateCartLogo();
  
      return;
    }

    const response = await post(`/cart`, {
      productId,
      quantity: parseInt(quantityValueElement.value),
      size: chosenSize,
    });

    if (!response.success) throw new Error(response.message);

    showMessage("Item added to cart successfully!");
    header.updateCartLogo();
   
  } catch (err) {
    console.error("Error adding to cart:", err);
    showMessage(`Error adding to cart: ${err.message}`);
  
  } finally{
    addToCartBtn.disabled = false;
    addToCartBtn.textContent = "Add To Cart";
  }
};

// Load product information when the page loads
document.addEventListener("DOMContentLoaded", populateProductInfo);

function showMessage(message) {
   const messageDialog = document.querySelector('message-dialog');
   messageDialog.showMessage(message);
}
