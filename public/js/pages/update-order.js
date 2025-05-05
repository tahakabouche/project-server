import { get, put } from "../modules/api.js";
import "../../components/side-bar.js";
import "../../components/state-dropdown-menu.js";
import "../../components/shipping-type-menu.js";
import "../../components/order-status-menu.js";
import "../../components/order-item-tr.js";
import "../../components/admin-order-summary.js";
import "../../components/message-dialog.js";

const orderId = new URLSearchParams(window.location.search).get("id");

const orderFirstName = document.querySelector('#order-first-name');
const orderLastName = document.querySelector('#order-last-name');
const orderEmail = document.querySelector('#order-email');
const orderPhone = document.querySelector('#order-phone');
const orderShippingAddress = document.querySelector('#order-shipping-address');
const orderStateMenu = document.querySelector('state-dropdown-menu');
const orderShippingTypeMenu = document.querySelector('shipping-type-menu');
const orderStatusMenu = document.querySelector('order-status-menu');
const orderSummary = document.querySelector('order-summary');
const updateOrderBtn = document.querySelector('#update-order-btn');

updateOrderBtn.addEventListener('click', updateOrder);

async function updateOrder(){
    try{
        const response = await put(`orders/${orderId}`, getOrderFields());
    
        if(response.success){
            showMessage('order was updated successfully');
        }
    }catch(error){
        console.log(error);
        
        showMessage(error.message);
    }
}

function getOrderFields(){
    return {
        firstName: orderFirstName.value,
        lastName: orderLastName.value,
        email: orderEmail.value,
        phone: orderPhone.value,
        shippingAddress:{
            state: orderStateMenu.selected,
            address: orderShippingAddress.value
        },
        status:  orderStatusMenu.selected,
        shippingType: orderShippingTypeMenu.selected,
    }
}

async function fetchOrderInfo() {

    const response = await get(`orders/${orderId}`);
    const order = response.data;
 
    if (order) {
        orderSummary.data = order;    
    }

    orderFirstName.value = order.firstName;
    orderLastName.value = order.lastName;
    orderEmail.value = order.email;
    orderPhone.value = order.phone;
    orderShippingAddress.value = order.shippingAddress.address;
    orderStateMenu.selected = order.shippingAddress.state;
    orderStatusMenu.selected = order.status;
    orderShippingTypeMenu.selected = order.shippingType;
}

fetchOrderInfo();

function showMessage(message) {
   const messageDialog = document.querySelector('message-dialog');
   messageDialog.showMessage(message);
}