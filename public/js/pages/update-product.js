import { get, put, del, imageUploadRequest } from "../modules/api.js";
import "../../components/dropdown-menu.js";
import "../../components/image-uploader.js";
import "../../components/side-bar.js";
import "../../components/message-dialog.js";
import "../../components/confirmation-dialog.js";

const productId = new URLSearchParams(window.location.search).get("id");
window.productId = productId;
window.product = null;
const imagesToDelete = [];

// DOM elements
const addProductNameInput = document.getElementById("add-product-name");
const addProductPriceInput = document.getElementById("add-product-price");
const productDescription = document.getElementById("product-description-input");
const categoryMenu = document.querySelector("dropdown-menu");
const addProductBtn = document.getElementById("add-product-btn");
const deleteProductBtn = document.getElementById("delete-product-btn");
const imageUploader = document.querySelector("image-uploader");

const productQuantityContainer = document.querySelector('.product-quantity-div');

document.addEventListener('productTypeChange', changeProductTypeQuantity);

let productCategory = null;

function changeProductTypeQuantity(event){
   console.log(event);
   
    if(event.detail.selected !== productCategory && productCategory !== 'Shoes' && event.detail.selected !== 'Shoes' && productCategory !== null)
    return;

    if(event.detail.selected === 'Shoes') {
      //shoe quantity
      productQuantityContainer.innerHTML = `
      <div class="dashboard-sub-container">
        <p>36</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"
        />
      </div>
      <div class="dashboard-sub-container">
        <p>37</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"             
        />
      </div>
      <div class="dashboard-sub-container">
        <p>38</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"     
        />
      </div>
      <div class="dashboard-sub-container">
        <p>39</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"          
      />
      </div>
      <div class="dashboard-sub-container">
        <p>40</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"        
        />
      </div>
      <div class="dashboard-sub-container">
        <p>41</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"
          id="xx-large-quantity"
        />
      </div>
      <div class="dashboard-sub-container">
        <p>42</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"   
        />
      </div>
      <div class="dashboard-sub-container">
        <p>43</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"          
        />
      </div>
      <div class="dashboard-sub-container">
        <p>44</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"        
        />
      </div>
      <div class="dashboard-sub-container">
        <p>45</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"           
        />
      </div>
      <div class="dashboard-sub-container">
        <p>46</p>
        <input
          type="text"
          class="sign-input shoe-size-quantity"  
        />
      </div>
      `;
    }else{
      //cloathing quantity
      productQuantityContainer.innerHTML = `
      <div class="dashboard-sub-container">
                <p>X-Small</p>
                <input
                  type="text"
                  class="sign-input clothing-size-quantity"
                  id="x-small-quantity"
                />
              </div>
              <div class="dashboard-sub-container">
                <p>Small</p>
                <input
                  type="text"
                  class="sign-input clothing-size-quantity"
                  id="small-quantity"
                />
              </div>
              <div class="dashboard-sub-container">
                <p>Medium</p>
                <input
                  type="text"
                  class="sign-input clothing-size-quantity"
                  id="medium-quantity"
                />
              </div>
              <div class="dashboard-sub-container">
                <p>Large</p>
                <input
                  type="text"
                  class="sign-input clothing-size-quantity"
                  id="large-quantity"
                />
              </div>
              <div class="dashboard-sub-container">
                <p>X-Large</p>
                <input
                  type="text"
                  class="sign-input clothing-size-quantity"
                  id="x-large-quantity"
                />
              </div>
              <div class="dashboard-sub-container">
                <p>XX-Large</p>
                <input
                  type="text"
                  class="sign-input clothing-size-quantity"
                  id="xx-large-quantity"
                />
              </div>
              <div class="dashboard-sub-container">
                <p>3X-Large</p>
                <input
                  type="text"
                  class="sign-input clothing-size-quantity"
                  id="3x-large-quantity"
                />
              </div>      
      `;
    }

    if(productCategory === null) populateProductQuantity();
    productCategory = event.detail.selected;
    
}

deleteProductBtn.onclick = async function deleteProduct() {
  confirmAction(`Are you sure you want to delete this product`);
  document.addEventListener('confirmed', async () => {
    
    const response = await del(`products/${productId}`);

    if(response.success){
      showMessage('The product was deleted successfully');
      setTimeout(() => {
        window.location.href = `/manage-products.html`;
      }, 2000);
    }else
      showMessage('Error while trying to delete the product');
  });
}

// Handle the product submission
addProductBtn.onclick = async function (e) {
  // Prevent default behavior
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Disable the button to prevent multiple clicks
  addProductBtn.disabled = true;

  try {
    const productData = getUpdateProductFields();
    const response = await put(`products/${productId}`, productData);
    if(!response.success) throw new Error();

    imagesToDelete.forEach((image => {
      if(window.product.images.includes(image.name)) { 
        del(`/products/${window.productId}/${image.name}`);
      }
    }));

    const filesToUpload = window.uploadedImages;

    // Upload files one by one to avoid potential issues
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      // get the extention of the uploaded file
      const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
    
      const formData = new FormData();
      if(!window.product.images.includes(file.name)) { 
          // upload each file with a unique filename
          formData.append("file", file.file, `${file.id}.${ext}`);
          await imageUploadRequest(`products/${productId}/photos`, {
            method: "PUT",
            body: formData,
          });
      }
    }
    
    showMessage('The product was updated successfully');
  } catch (error) {
    console.error("Error during product creation:", error);
    showMessage(`Error while trying to update the product: ${error.message}`);
  } finally {
    addProductBtn.disabled = false;
  }
  return false;
};

function getUpdateProductFields() {
  let sizes = [];
  let productType;

  if(productCategory === 'Shoes'){
    const shoeSizesQuantity = document.querySelectorAll(".shoe-size-quantity");
    sizes = [
      { size: "36", quantity: shoeSizesQuantity[0].value || 0 },
      { size: "37", quantity: shoeSizesQuantity[1].value || 0 },
      { size: "38", quantity: shoeSizesQuantity[2].value || 0 },
      { size: "39", quantity: shoeSizesQuantity[3].value || 0 },
      { size: "40", quantity: shoeSizesQuantity[4].value || 0 },
      { size: "41", quantity: shoeSizesQuantity[5].value || 0 },
      { size: "42", quantity: shoeSizesQuantity[6].value || 0 },
      { size: "43", quantity: shoeSizesQuantity[7].value || 0 },
      { size: "44", quantity: shoeSizesQuantity[8].value || 0 },
      { size: "45", quantity: shoeSizesQuantity[9].value || 0 },
      { size: "46", quantity: shoeSizesQuantity[10].value || 0 },
    ];
    productType = 'shoe'; 
  }else{
    const clothingSizesQuantity = document.querySelectorAll(".clothing-size-quantity");
    sizes = [
      { size: "XS", quantity: clothingSizesQuantity[0].value || 0 },
      { size: "S", quantity: clothingSizesQuantity[1].value || 0 },
      { size: "M", quantity: clothingSizesQuantity[2].value || 0 },
      { size: "L", quantity: clothingSizesQuantity[3].value || 0 },
      { size: "XL", quantity: clothingSizesQuantity[4].value || 0 },
      { size: "XXL", quantity: clothingSizesQuantity[5].value || 0 },
      { size: "3XL", quantity: clothingSizesQuantity[6].value || 0 },
    ];
    productType = 'clothing'; 
  } 
  return {
    name: addProductNameInput.value,
    category: categoryMenu.selected,
    description: productDescription.value,
    productType,
    price: addProductPriceInput.value,
    sizes,
  };
}

async function populateUpdateProductFields() {
  const response = await get(`products/${productId}`);

  window.product = response.data;

  addProductNameInput.value = response.data.name;
  productDescription.value = response.data.description;
  addProductPriceInput.value = response.data.price;
  categoryMenu.selected = response.data.category;

  for (let i = 0; i < response.data.images.length; i++) {
    let imageFile = await getImageFileFromSrc(
      `images/${response.data.images[i]}`,
      getFilenameWithoutExtension(response.data.images[i])
    );
    imageUploader.handleFiles([imageFile]);
  }
}

function populateProductQuantity(){
 
  if(window.product.category !== 'Shoes'){
    const clothingSizesQuantity = document.querySelectorAll(".clothing-size-quantity");
  
    clothingSizesQuantity[0].value = window.product.sizes[0].quantity;
    clothingSizesQuantity[1].value = window.product.sizes[1].quantity;
    clothingSizesQuantity[2].value = window.product.sizes[2].quantity;
    clothingSizesQuantity[3].value = window.product.sizes[3].quantity;
    clothingSizesQuantity[4].value = window.product.sizes[4].quantity;
    clothingSizesQuantity[5].value = window.product.sizes[5].quantity;
    clothingSizesQuantity[6].value = window.product.sizes[6].quantity;
  }else{
    const shoeSizesQuantity = document.querySelectorAll(".shoe-size-quantity");
    console.log(window.product.sizes);
    console.log(shoeSizesQuantity);
    
    shoeSizesQuantity[0].value = window.product.sizes[0].quantity;
    shoeSizesQuantity[1].value = window.product.sizes[1].quantity;
    shoeSizesQuantity[2].value = window.product.sizes[2].quantity;
    shoeSizesQuantity[3].value = window.product.sizes[3].quantity;
    shoeSizesQuantity[4].value = window.product.sizes[4].quantity;
    shoeSizesQuantity[5].value = window.product.sizes[5].quantity;
    shoeSizesQuantity[6].value = window.product.sizes[6].quantity;
    shoeSizesQuantity[7].value = window.product.sizes[7].quantity;
    shoeSizesQuantity[8].value = window.product.sizes[8].quantity;
    shoeSizesQuantity[9].value = window.product.sizes[9].quantity;
    shoeSizesQuantity[10].value = window.product.sizes[10].quantity;
  }
}

async function getImageFileFromSrc(src, filename = "image") {
  // Check if it's a base64 data URI
  if (src.startsWith("data:image/")) {
    const arr = src.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const ext = mime.split("/")[1].split(";")[0];
    return new File([u8arr], `${filename}.${ext}`, { type: mime });
  } else {
    // It's a URL — fetch the image as a Blob
    const response = await fetch(src);
    const blob = await response.blob();
    const mime = blob.type;
    const ext = mime.split("/")[1];
    return new File([blob], normalizeExtension(`${filename}.${ext}`), {
      type: mime,
    });
  }
}

function getFilenameWithoutExtension(filename) {
  return filename.split(".").slice(0, -1).join(".");
}

function normalizeExtension(filename) {
  return filename.replace(/\.jpeg$/i, ".jpg");
}

document.addEventListener("image-deleted", (event) => {
  const { image } = event.detail;
  imagesToDelete.push(image); 
});

populateUpdateProductFields();

function showMessage(message) {
  const messageDialog = document.querySelector('message-dialog');
  messageDialog.showMessage(message);
}

function confirmAction(message) {
  const confirmationDialog = document.querySelector('confirmation-dialog');
  confirmationDialog.showMessage(message);
}