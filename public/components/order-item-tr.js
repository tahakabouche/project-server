class OrderItemTr extends HTMLTableRowElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
                <td>
                    <div class="order-item-thumbnail">
                      <img class="order-item-image"/>
                      <p class="order-item-desc"></p>
                    </div>       
                </td>
                <td class="order-item-total"></td>
      `;
    // Save references to the elements for later use
    this.orderItemName = this.querySelector(".order-item-desc");
    this.orderItemImage = this.querySelector(".order-item-image");
    this.orderItemTotal = this.querySelector(".order-item-total");

    // If product data was already set before connectedCallback ran
    if (this._orderItem) {
      this._render(this._orderItem);
    }
  }

  set data(orderItem) {
    this._orderItem = orderItem;
    if (this.isConnected) {
      this._render(orderItem);
    }
  }

  _render(item) {
    console.log(item.product);
    console.log(this.orderItemImage);
    this.orderItemImage.src = `images/${item.product.images[0]}`;  
    this.orderItemName.innerText = `${item.product.name} × ${item.quantity} - ${item.size}`;
    this.orderItemTotal.innerText = `${item.quantity * item.product.price}DA`;
  }
}
customElements.define("order-item-tr", OrderItemTr, { extends: "tr" });
