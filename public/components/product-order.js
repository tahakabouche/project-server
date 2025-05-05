class MyProductOrder extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <div class="product-detail-page-container">
       <div style="padding-top: 0;" class="product-page-sub-div">
         <h1 style="margin-bottom: 1.1rem;font-family: 'Integral CF';" id="product-name">Product</h1>
         <h2 style="letter-spacing: 0px; font-size: 3.3rem; font-weight: 700; margin-bottom: 2rem;" id="product-price">$150</h2>
         <p id="product-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus itaque est, quisquam error necessitatibus blanditiis!</p>
       </div>
       <div class="product-page-sub-div">
         <p style="margin: 0 0.5rem 2rem;">Available Sizes:</p>
         <div class="product-page-size-choices">
           
         </div>
       </div>
         <div style="border: 0;" class="product-page-sub-div">
           <div style="display: flex; justify-content: space-between;"> 
           <div style="margin-right: 2rem;" class="quantity">
             <div class="quantity__div ">
               <button style="cursor: pointer;" class="quantity-btn mbtn">
                 <img style="min-width: 18.75px; min-height: 2.25px;" src="../assets/icons/-.svg" alt="" />
               </button>
               <input id="quantity-value" class="quantity-value-class" type="number" readonly />
               <button style="cursor: pointer;" class="quantity-btn pbtn">
                 <img style="min-width: 18.75px;  min-height:18.75px;" src="../assets/icons/+.svg" alt="" />
               </button>
             </div>
           </div>
           <button style="cursor: pointer; flex-grow: 1; max-height: 5.2rem;" class="btn btn--primary" id="add-to-cart-btn">Add To Cart</button>
         </div>
         </div>
       </div>
     </div>`;
  }

  connectedCallback() {
    this.productName = document.querySelector("#product-name");
    this.productPrice = document.querySelector("#product-price");
    this.productDescription = document.querySelector("#product-description");
    this.addToCartBtn = document.querySelector("#add-to-cart-btn");
    this.sizesContainer = this.querySelector(".product-page-size-choices");

    this.plusBtn = document.querySelector(".pbtn");
    this.minusBtn = document.querySelector(".mbtn");
    this.quantityValueElement = document.querySelector("#quantity-value");

    this.addToCartBtn.addEventListener("click", () => window.addToCart());

    if (this._product) {
      this._render(this._product);
    }
  }

  _render(product) {
    this.productName.innerText = product.name;
    this.productPrice.innerText = product.price;
    this.productDescription.innerText = product.description;
    if(product.category === 'Shoes'){
      this.sizesContainer.innerHTML = '<shoe-size-menu></shoe-size-menu>';
      this.shoeSizeOptions = Array.from(document.querySelectorAll(".shoe-size-option"));
    }else{
      this.sizesContainer.innerHTML = ` 
        <button data-value="XS" class="btn btn--secondary btn--filter btn--gray-hov">X-Small</button>
        <button data-value="S" class="btn btn--secondary btn--filter btn--gray-hov">Small</button>
        <button data-value="M" class="btn btn--secondary btn--filter btn--gray-hov">Medium</button>
        <button data-value="L" class="btn btn--secondary btn--filter btn--gray-hov">Large</button>
        <button data-value="XL" class="btn btn--secondary btn--filter btn--gray-hov">X-Large</button>
        <button data-value="XXL" class="btn btn--secondary btn--filter btn--gray-hov">XX-Large</button>
        <button data-value="3XL" class="btn btn--secondary btn--filter btn--gray-hov">3X-Large</button>
       `;

      this.cloathingSizeOptions = Array.from(document.querySelectorAll(".btn--filter"));  
    }

    this.showAvailableSizes(product);
  }

  showAvailableSizes(product) {
    product.sizes.forEach((size) => {
      if (size.quantity > 0) {
        window.availableSizes.push(size.size);
      }
    });

    if (window.availableSizes.length === 0) {
      this.sizesContainer.innerHTML = `<p style="color: red;">This product is currently out of stock and unavailable.</p>`;
    }

    if(product.category !== 'Shoes'){
      this.cloathingSizeOptions.forEach((size) => {
        if (!window.availableSizes.includes(size.dataset.value)) {
          size.style.display = "none";
        }
      });
      const cloathingSizes = document.querySelectorAll(".product-page-size-choices button");
      cloathingSizes.forEach((element) => {
        element.addEventListener("click", () => window.updateCloathingChosenSize(element));
      });
    }else{
      this.shoeSizeOptions.forEach((size) => {
        if (!window.availableSizes.includes(size.dataset.value)) {
          size.style.display = "none";
        }
      });
      const shoeSizes = document.querySelectorAll(".shoe-size-option");
      shoeSizes.forEach((element) => {
        element.addEventListener("click", () => window.updateShoeChosenSize(element));
      });
    }
  }

  set data(product) {
    this._product = product;
    if (this.isConnected) {
      this._render(product);
    }
  }
}

customElements.define("product-order", MyProductOrder);
