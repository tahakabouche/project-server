class MyProductCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="product-card">
      <div class="image-wrapper">
      <img class="product-card__image" />
      </div>
      <div class="product-card__content">
        <h3 class="product-card__name"></h3>
        <h2 class="product-card__price"></h2>
        <a id="edit-product-btn">
          <button class="btn-square-secondary" >Edit</button>
        </a>
      </div>
    </div>
  `;
    // Save references to the elements for later use
    this.image = this.querySelector(".product-card__image");
    this.name = this.querySelector(".product-card__name");
    this.price = this.querySelector(".product-card__price");
    this.editProductBtn = this.querySelector("#edit-product-btn");

    // If product data was already set before connectedCallback ran
    if (this._product) {
      this._render(this._product);
    }
  }

  set data(product) {
    this._product = product;
    if (this.isConnected) {
      this._render(product);
    }
  }

  _render(product) {
    this.productId = product._id;
    this.image.src = `/images/${product.images[0]}`;
    this.name.textContent = product.name;
    this.price.textContent = `${product.price.toLocaleString('en-US')}DA`;
    this.editProductBtn.href = `/update-product.html?id=${product._id}`;
  }
}

customElements.define("product-card", MyProductCard);
