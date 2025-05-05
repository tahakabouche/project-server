import { isAuthenticated } from "../js/modules/auth.js";
import{ getCart, setCart} from "../js/modules/utils.js"

class MyCartItem extends HTMLElement {
  // Define the attributes to observe
  static get observedAttributes() {
    return ["quantity", "price", "name", "image", "size", "productid"];
  }

  constructor() {
    super();
    // Don't set innerHTML in constructor

    // Bind the methods
    this.incrementQuantity = this.incrementQuantity.bind(this);
    this.decrementQuantity = this.decrementQuantity.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  // Create and initialize the DOM structure when the element is connected
  connectedCallback() {
    // Create the DOM structure only once
    if (!this.initialized) {
      this.createDOMStructure();
      this.setupEventListeners();
      this.updateFromAttributes();
      this.initialized = true;
    }
  }

  // Create the DOM structure
  createDOMStructure() {
    this.innerHTML = `
      <div class="cart-item">
        <img class="cart-item__image" src="" alt="" />
        <div class="cart-item__description">
          <div>
            <h3 id="cart-product-name">Product</h3>
            <p id="cart-item-size">Size:</p>
          </div>
          <h2>DA<span id="cart-item-price">2000</span></h2>
        </div>
        <div class="cart-item__action">
          <button class="cart-item__remove">
            <img src="../assets/icons/delete.svg" alt="" />
          </button>
          <div style="margin-right: 2rem;" class="quantity cart-item__quantity">
            <div class="quantity__div">
              <button class="quantity-btn mbtn">
                <img style="min-width: 18.75px; min-height: 2.25px;" src="../assets/icons/-.svg" alt="" />
              </button>
              <input id="quantity-value" type="number" class="quantity-value-class" value="1" readonly />
              <button class="quantity-btn pbtn">
                <img style="min-width: 18.75px; min-height:18.75px;" src="../assets/icons/+.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Store references to elements
    this.cartItemImage = this.querySelector(".cart-item__image");
    this.cartItemName = this.querySelector("#cart-product-name");
    this.cartItemSize = this.querySelector("#cart-item-size");
    this.cartItemPrice = this.querySelector("#cart-item-price");
    this.plusBtn = this.querySelector(".pbtn");
    this.minusBtn = this.querySelector(".mbtn");
    this.cartItemQuantity = this.querySelector("#quantity-value");
    this.deleteCartItemBtn = this.querySelector(".cart-item__remove");
  }

  // Setup event listeners
  setupEventListeners() {
    this.plusBtn.addEventListener("click", this.incrementQuantity);
    this.minusBtn.addEventListener("click", this.decrementQuantity);
    this.deleteCartItemBtn.addEventListener("click", this.removeItem);
  }

  // Update the DOM from attributes
  updateFromAttributes() {
    this.cartItemImage.src = this.getAttribute("image") || "";
    this.cartItemName.innerText = this.getAttribute("name") || "Product";
    this.cartItemSize.innerText = "Size: " + (this.getAttribute("size") || "");
    this.cartItemPrice.innerText = this.getAttribute("price") || "0";
    this.cartItemQuantity.value = this.getAttribute("quantity") || "1";
  }

  disconnectedCallback() {
    // Clean up event listeners
    if (this.initialized) {
      this.plusBtn.removeEventListener("click", this.incrementQuantity);
      this.minusBtn.removeEventListener("click", this.decrementQuantity);
      this.deleteCartItemBtn.removeEventListener("click", this.removeItem);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue || !this.initialized) return;

    switch (name) {
      case "quantity":
        if (this.cartItemQuantity) this.cartItemQuantity.value = newValue;
        break;
      case "price":
        if (this.cartItemPrice) this.cartItemPrice.innerText = newValue;
        break;
      case "name":
        if (this.cartItemName) this.cartItemName.innerText = newValue;
        break;
      case "image":
        if (this.cartItemImage) this.cartItemImage.src = newValue;
        break;
      case "size":
        if (this.cartItemSize)
          this.cartItemSize.innerText = "Size: " + newValue;
        break;
    }
  }

  incrementQuantity() {
    let currentValue = parseInt(this.cartItemQuantity.value) || 0;
    if (currentValue < 99) {
      currentValue++;
      this.cartItemQuantity.value = currentValue;
      this.setAttribute("quantity", currentValue);

      if(!isAuthenticated()){
        const cart = getCart();

        const cartItem = cart.find(
          (item) => item.product._id === this.getAttribute('productid') && item.size === this.getAttribute('size')
        );
        cartItem.quantity = currentValue;

        setCart(cart);
      }

      window.updateTotal();
    }
  }

  decrementQuantity() {
    let currentValue = parseInt(this.cartItemQuantity.value) || 0;
    if (currentValue > 1) {
      currentValue--;
      this.cartItemQuantity.value = currentValue;
      this.setAttribute("quantity", currentValue);

      if(!isAuthenticated()){
        const cart = getCart();

        const cartItem = cart.find(
          (item) => item.product._id === this.getAttribute('productid') && item.size === this.getAttribute('size')
        );
        cartItem.quantity = currentValue;
        
        setCart(cart);
      }
      
      window.updateTotal();
    }
  }

  async removeItem() {
    this.parentNode.remove();
    window.adjustLastItem();
    window.deleteCartItem(
      this.getAttribute("productid"),
      this.getAttribute("size")
    );
    window.updateTotal();
  }
}

// Define the custom element
customElements.define("cart-item", MyCartItem);
