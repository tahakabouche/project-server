class MyFilter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
          <div class="filter-container">
                  <div class="container__sub-div flex-sub-div">
                    <h3>Filters</h3>
                    <img src="assets/icons/filters.svg" alt="" />
                  </div>
                   
                  <div class="container__sub-div">
                    <button class="flex-sub-div filters-collapse-btn" onclick=toggleSubMenu(this)>
                      <h3 ">Categories</h3>
                      <img  src="assets/icons/arrow.svg"  class="filters-arrow down" />
                    </button>
                
                  <ul class="collapsible expanded">
                    <div class="category-filters">
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          T-shirts
                          <input type="checkbox" id="t-shirts-category" data-value="T-shirts" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Sweatshirts
                          <input type="checkbox" id="sweatshirts-category" data-value="Sweatshirts" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Hoodies
                          <input type="checkbox" id="hoodies-category" data-value="Hoodies" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Jackets
                          <input type="checkbox" id="jackets-category" data-value="Jackets" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Pants
                          <input type="checkbox" id="pants-category" data-value="Pants" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Shoes
                          <input type="checkbox" id="shoes-category" data-value="Shoes" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                    </div>
                  </ul>
                  </div>
                
                  <div class="container__sub-div">
                         <button class="flex-sub-div filters-collapse-btn" onclick=toggleSubMenu(this)>
                           <h3>Price</h3>
                           <img  src="assets/icons/arrow.svg" class="filters-arrow down" />
                         </button>
                         <ul class="collapsible expanded">
                            <div class="price-range-filter">
                                <li>
                                  <p>Min price:</p>
                                  <input class="price-range-filter-input" type="number" name="" id="min-price" />     
                                </li>
                                <li>
                                  <p>Max price:</p>
                                  <input class="price-range-filter-input" type="number" name="" id="max-price" /> 
                                </li>
                            </div>
                        </ul>
                  </div>
                
                  <div class="container__sub-div">
                      <button class="flex-sub-div filters-collapse-btn" onclick=toggleSubMenu(this)>
                        <h3>Size</h3>
                        <img src="assets/icons/arrow.svg" class="filters-arrow down" />
                      </button>
                  
                      <ul class=" collapsible expanded ">
                        <div class="size-filters-grid">
                          <li><button data-value="XS" class="btn btn--secondary btn--filter btn--gray-hov">X-Small</button></li>
                          <li><button data-value="S" class="btn btn--secondary btn--filter btn--gray-hov">Small</button></li>
                          <li><button data-value="M" class="btn btn--secondary btn--filter btn--gray-hov">Medium</button></li>
                          <li><button data-value="L" class="btn btn--secondary btn--filter btn--gray-hov">Large</button></li>
                          <li><button data-value="XL" class="btn btn--secondary btn--filter btn--gray-hov">X-Large</button></li>
                          <li><button data-value="XXL" class="btn btn--secondary btn--filter btn--gray-hov">XX-Large</button></li>
                          <li><button data-value="3XL" class="btn btn--secondary btn--filter btn--gray-hov">3X-Large</button></li>
                        </div>
                      </ul>
                  </div>
                
                  <button class="btn btn--primary" id="apply-filter-btn">Apply Filter</button>
                </div>

             <div class="backdrop">   
                <div class="menu-filter-container">
                  <div class="container__sub-div flex-sub-div">
                    <h3>Filters</h3>
                    <a class="close-filter-menu-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </a>
                  </div>
                   
                  <div class="container__sub-div">
                    <button class="flex-sub-div filters-collapse-btn" onclick=toggleSubMenu(this)>
                      <h3 ">Categories</h3>
                      <img  src="assets/icons/arrow.svg"  class="filters-arrow down" />
                    </button>
                
                       <ul class="collapsible expanded">
                    <div class="category-filters">
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          T-shirts
                          <input type="checkbox" id="t-shirts-category" data-value="T-shirts" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Sweatshirts
                          <input type="checkbox" id="sweatshirts-category" data-value="Sweatshirts" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Hoodies
                          <input type="checkbox" id="hoodies-category" data-value="Hoodies" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Jackets
                          <input type="checkbox" id="jackets-category" data-value="Jackets" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Pants
                          <input type="checkbox" id="pants-category" data-value="Pants" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                      <li class="category-filters__subdiv">
                        <label class="checkbox-wrapper">
                          Shoes
                          <input type="checkbox" id="shoes-category" data-value="Shoes" class="product-category-filter">
                          <span class="checkmark"></span>
                        </label>
                      </li>
                    </div>
                  </ul>
                  </div>
                
                  <div class="container__sub-div">
                         <button class="flex-sub-div filters-collapse-btn" onclick=toggleSubMenu(this)>
                           <h3>Price</h3>
                           <img  src="assets/icons/arrow.svg" class="filters-arrow down" />
                         </button>
                         <ul class="collapsible expanded">
                            <div class="price-range-filter">
                                <li>
                                  <p>Min price:</p>
                                  <input class="price-range-filter-input" type="number" name="" id="min-price" />     
                                </li>
                                <li>
                                  <p>Max price:</p>
                                  <input class="price-range-filter-input" type="number" name="" id="max-price" /> 
                                </li>
                            </div>
                        </ul>
                  </div>
                
                  <div class="container__sub-div">
                      <button class="flex-sub-div filters-collapse-btn" onclick=toggleSubMenu(this)>
                        <h3>Size</h3>
                        <img src="assets/icons/arrow.svg" class="filters-arrow down" />
                      </button>
                  
                      <ul class=" collapsible expanded ">
                        <div class="size-filters-grid">
                          <li><button data-value="XS" class="btn btn--secondary btn--filter btn--gray-hov">X-Small</button></li>
                          <li><button data-value="S" class="btn btn--secondary btn--filter btn--gray-hov">Small</button></li>
                          <li><button data-value="M" class="btn btn--secondary btn--filter btn--gray-hov">Medium</button></li>
                          <li><button data-value="L" class="btn btn--secondary btn--filter btn--gray-hov">Large</button></li>
                          <li><button data-value="XL" class="btn btn--secondary btn--filter btn--gray-hov">X-Large</button></li>
                          <li><button data-value="XXL" class="btn btn--secondary btn--filter btn--gray-hov">XX-Large</button></li>
                          <li><button data-value="3XL" class="btn btn--secondary btn--filter btn--gray-hov">3X-Large</button></li>
                        </div>
                      </ul>
                  </div>
                
                  <button class="btn btn--primary" id="apply-filter-btn">Apply Filter</button>
                </div>
          </div>
          `;
  }
}

customElements.define("my-filter", MyFilter);
