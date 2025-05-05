import "../../components/header.js";
import "../../components/cart-item.js";
import { get, del, put } from "../modules/api.js";
import { isAuthenticated } from "../modules/auth.js";
import { getCart, setCart } from "../modules/utils.js";

const cartContainer = document.querySelector(".cart");
const subTotal = document.getElementById("sub-total");
const cartTotal = document.getElementById("total");
const myHeader = document.querySelector("my-header");

function getCartItems() {
  return document.querySelectorAll(".cart-row");
}

window.deleteCartItem = (productId, size) => {
  if(isAuthenticated()) {
    return del(`cart/${productId}?size=${size}`);
  }     
  else {
   const cart = getCart().filter(item => !(item.product._id === productId && item.size === size));
   setCart(cart);
  }

};

window.updateTotal = () => {
  const cart = getCartItems();

  let cartQuantityValues = [];
  let cartItemsPrices = [];
  let sum = 0;
  console.log("executing updateTotal");

  cart.forEach((element) => {
    const cartItem = element.querySelector("cart-item");

    if(isAuthenticated()){
      put(`cart/${cartItem.getAttribute("productid")}`, {
        size: cartItem.getAttribute("size"),
        quantity: cartItem.getAttribute("quantity"),
      }).catch((error) => console.log("failed to update cart item.", error));
    }
   
    //pushes the quantity of each cart-item into the cartQuantityValues array
    const quantity = parseInt(cartItem.getAttribute("quantity") || 0);
    //pushes the price of each cart-item into the cartItemsPrices array
    const price = parseInt(cartItem.getAttribute("price") || 0);

    cartQuantityValues.push(quantity);
    cartItemsPrices.push(price);
  });

  for (let i = 0; i < cartQuantityValues.length; i++) {
    sum += cartQuantityValues[i] * cartItemsPrices[i];
  }

  subTotal.innerText = `DA${sum.toLocaleString("en-US")}`;
  cartTotal.innerText = `DA${sum.toLocaleString("en-US")}`;
  myHeader.cartTotal = sum;
  myHeader.cartItemsCount = cart.length;
};

window.adjustLastItem = () => {
  let cartItems = getCartItems();
  if (cartItems.length > 0) {
    let lastItem = cartItems[cartItems.length - 1];
    lastItem.style.marginBottom = "0px";
    lastItem.style.borderBottom = "0px";

    const cartItemElement = lastItem.querySelector(".cart-item");
    if (cartItemElement) {
      cartItemElement.style.marginBottom = "0px";
    }
  } else if (cartContainer) {
    cartContainer.innerHTML = `
      <h1 style="font-family:'Integral CF';">your cart is empty</h1>
    `;
  }
};

// This is the key function that's causing the error
async function fetchCart() {
  try {
      let cart = [];
      if(isAuthenticated()) {
        const response = await get("cart");
        cart = response.data.cart;
      }
      else {
        cart = getCart();
      }

      cart.forEach((element) => {
        // First create the container
        const cartRow = document.createElement("div");
        cartRow.className = "cart-row";
        cartContainer.appendChild(cartRow);

        // Now create the custom element - AFTER adding its container to the DOM
        // This is important to prevent the error
        const productId = element.product._id || "";
        const price = element.product.price || "0";
        const name = element.product.name || "Product";
        const quantity = element.quantity || "1";
        const size = element.size || "";
        let image = "";

        // Make sure there's at least one image
        if (element.product.images && element.product.images.length > 0) {
          image = element.product.images[0];
        }

        // Create the HTML string for the custom element
        cartRow.innerHTML = `<cart-item 
          productid="${productId}" 
          price="${price}" 
          name="${name}" 
          quantity="${quantity}" 
          size="${size}" 
          image="images/${image}">
        </cart-item>`;
      });

      adjustLastItem();
    
  } catch (error) {
    console.error("Error fetching cart:", error);
    if (cartContainer) {
      cartContainer.innerHTML = `
        <h1 style="font-family:'Integral CF';">Error loading cart</h1>
      `;
    }
  }
}

// Initialize the cart
(async function init() {
  await fetchCart();
  window.updateTotal();
})();
