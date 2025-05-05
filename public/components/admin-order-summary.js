import "./order-item-tr.js";

class AdminOrderSummary extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
              <div class="order-summary-container">
    
                <h2>Order items</h2>
                <div class="order-items-container">
                  <table class="order-summary-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <td>Subtotal</td>
                      </tr>
                    </thead>
                    <tbody class="order-items-sub-container">
        
                    </tbody>
                    <tfoot>
                        <tr class="order-subtotal">
                          <th>Subtotal</th>
                          <td >1515</td>
                        </tr>
                        <tr class="shipping-options-row">
                            <th>Shipping Cost</th>
                            <td class="order-shipping-cost">
                              
                            </td>                       
                        </tr>
                        <tr class="order-total">
                          <th>Total</th>
                          <td >1515</td>
                        </tr>
                    </tfoot>
                   </table>
                  </div>
              </div>
          </div>  
      `;
    // Save references to the elements for later use
    this.orderSubTotal = document.querySelector(".order-subtotal td");
    this.orderTotal = document.querySelector(".order-total td");
    this.orderShippingCost= document.querySelector(".order-shipping-cost");
    this.orderItemsContainer = document.querySelector(
      ".order-items-sub-container"
    );


    // If product data was already set before connectedCallback ran
    if (this._order) {
      this._render(this._order);
    }
  }

  set data(order) {
    this._order = order;
    if (this.isConnected) {
      this._render(order);
    }
  }

  _render(order) {
    order.items.forEach((item) => {
      const orderItemTr = document.createElement("tr", { is: "order-item-tr" });
      orderItemTr.data = item;
      this.orderItemsContainer.appendChild(orderItemTr);
    });
    this.orderTotal.innerText = `${order.total.toLocaleString('en-US')}DA`;
    this.orderSubTotal.innerText = `${(order.total - order.shippingCost).toLocaleString('en-US')}DA`;
    this.orderShippingCost.innerText = `${order.shippingCost.toLocaleString('en-US')}DA`;
  }
}

customElements.define("order-summary", AdminOrderSummary);
