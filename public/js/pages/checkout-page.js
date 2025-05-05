import "../../components/state-dropdown-menu.js";
import "../../components/header.js";
import "../../components/order-item-tr.js";
import "../../components/message-dialog.js";
import { get, post } from "../modules/api.js";
import { isAuthenticated } from "../modules/auth.js";
import { clearCart, getCart } from "../modules/utils.js";

let shippingType;
let shippingCost;
let subTotal;

const orderItemsContainer = document.querySelector(
  ".order-items-sub-container"
);

const orderShippingOptionsContainer = document.querySelector(
  ".order-shipping-options"
);

const orderSubTotal = document.querySelector(".order-subtotal td");
const orderTotal = document.querySelector(".order-total td");
const firstNameInput = document.querySelector("#first-name-input");
const lastNameInput = document.querySelector("#last-name-input");
const emailInput = document.querySelector("#email-input");
const phoneInput = document.querySelector("#phone-input");
const stateMenu = document.querySelector("state-dropdown-menu");
const addressInput = document.querySelector("#address-input");
const placeOrderBtn = document.querySelector(".place-order-btn");

placeOrderBtn.addEventListener("click", placeOrder);

document.addEventListener("stateChanged", updateShippingOptions);

async function updateShippingOptions(event) {
  const response = await get(`shipping/${event.detail.state}`);
  const shippingRate = response.data;

  orderShippingOptionsContainer.innerHTML = `
    <ul>
        <li class="shipping-option-sub-div">
        <div class="radio-item"> 
            <input type="radio" name="shipping-option" id="stopdesk-shipping-option" value="Stopdesk" />
            <label for="stopdesk-shipping-option"><span class="radio-control"></span>Stopdesk</label>
        </div>
        <div> 
            <span>${shippingRate.stopDeskCost.toLocaleString("en-US")}DA</span>
        </div>
        </li>

        <li class="shipping-option-sub-div">
            <div class="radio-item"> 
                <input type="radio" name="shipping-option" id="home-shipping-option" value="Home"/>
                <label for="home-shipping-option"><span class="radio-control"></span>Home</label>
            </div>
            <div> 
                  <span>${shippingRate.homeCost.toLocaleString(
                    "en-US"
                  )}DA</span>
            </div>
        </li>    
    </ul>  
    `;
  const shippingOptionRadios = document.querySelectorAll(
    'input[name="shipping-option"]'
  );
  shippingOptionRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      const selected = document.querySelector(
        'input[name="shipping-option"]:checked'
      );
      shippingType = selected.value;
      if (shippingType === "Home") shippingCost = shippingRate.homeCost;
      else shippingCost = shippingRate.stopDeskCost;

      updateTotal();
    });
  });
}

function getOrderFields() {
  return {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    state: stateMenu.selected,
    address: addressInput.value,
    shippingType,
  };
}

async function placeOrder() {
  try {
    if (isAuthenticated()) {
      const response = await post("orders", getOrderFields());
      if (response.success) {
        showMessage("order placed successfully");
        setTimeout(() => {
          window.location.href = `/`;
        }, 2000);
      }
    } else {
      const response = await post("orders", {
        ...getOrderFields(),
        cart: getCart(),
      });
      if (response.success) {
        showMessage("order placed successfully");
        clearCart();
        setTimeout(() => {
          window.location.href = `/`;
        }, 2000);
      }
    }
  } catch (error) {
    showMessage(error.message);
  }
}

async function fetchOrderItems() {
  let cart;

  if (isAuthenticated()) {
    const response = await get("cart");
    cart = response.data.cart;
  } else {
    cart = getCart();
  }

  if (cart) {
    cart.forEach((item) => {
      const orderItemTr = document.createElement("tr", { is: "order-item-tr" });
      orderItemTr.data = item;
      orderItemsContainer.appendChild(orderItemTr);
    });

    subTotal = cart.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    orderSubTotal.innerText = `${subTotal.toLocaleString("en-US")}DA`;
    //todo add shipping cost to total
    orderTotal.innerText = `${subTotal.toLocaleString("en-US")}DA`;
  }
}

function updateTotal() {
  let total = subTotal + shippingCost;
  orderTotal.innerText = `${total.toLocaleString("en-US")}DA`;
}

function showMessage(message) {
  const messageDialog = document.querySelector('message-dialog');
  messageDialog.showMessage(message);
}

fetchOrderItems();
