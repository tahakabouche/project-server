import { apiRequest, post, imageUploadRequest } from "../modules/api.js";
import "../../components/dropdown-menu.js";
import "../../components/image-uploader.js";
import "../../components/side-bar.js";
import "../../components/message-dialog.js";

// Cache DOM elements
const addProductNameInput = document.getElementById("add-product-name");
const addProductPriceInput = document.getElementById("add-product-price");
const productDescription = document.getElementById("product-description-input");
const categoryMenu = document.querySelector("dropdown-menu");
const addProductBtn = document.getElementById("add-product-btn");
const imageUploader = document.querySelector("image-uploader");

const productQuantityContainer = document.querySelector('.product-quantity-div');

document.addEventListener('productTypeChange', changeProductTypeQuantity);

let productCategory = null;

function changeProductTypeQuantity(event){
   console.log(event);
   
    if(event.detail.selected !== productCategory && productCategory !== 'Shoes' && event.detail.selected !== 'Shoes' )
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

    productCategory = event.detail.selected;
}

addProductBtn.onclick = async function (e) {
  // Prevent default behavior
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  addProductBtn.disabled = true;
  try {
    const productData = getAddProductFields();
    
    const productResponse = await post("products", productData);
    const productId = productResponse.data._id;

    // Then upload any selected files
    const filesToUpload = window.uploadedImages;

    console.log(`Uploading ${filesToUpload.length} files...`);

    if (filesToUpload.length > 0) {
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        console.log(
          `Uploading file ${i + 1}/${filesToUpload.length}: ${file.file.name}`
        );
        // get the extention of the uploaded file
        const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);

        const formData = new FormData();

        // upload each file with a unique filename
        formData.append("file", file.file, `${file.id}.${ext}`);
        await imageUploadRequest(`products/${productId}/photos`, {
          method: "PUT",
          body: formData,
        });

        console.log(`File ${i + 1} uploaded successfully`);
      }
    }
    showMessage('A product was created successfully');
    //clearForm();
  } catch (error) {
    console.error("Error during product creation:", error);
    showMessage(`Error during product creation: ${error.message}`);
  } finally {
    addProductBtn.disabled = false;
  }

  return false;
};


function clearForm() {
  addProductNameInput.value = "";
  addProductPriceInput.value = "";

  if(productCategory === "Shoes"){
    const shoeSizesQuantity = document.querySelectorAll(".shoe-size-quantity");
    shoeSizesQuantity.forEach((input) => {
      input.value = "";
    });
  }else{
    const clothingSizesQuantity = document.querySelectorAll(".clothing-size-quantity");
    clothingSizesQuantity.forEach((input) => {
      input.value = "";
    });
  }

  imageUploader.clearImages();
  categoryMenu.selected = null;
}


function getAddProductFields() {
  let sizes = [];
  let productType;

  if(productCategory === 'Shoes'){
    const shoeSizesQuantity = Array.from(document.querySelectorAll(".shoe-size-quantity"));
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
    const clothingSizesQuantity = Array.from(document.querySelectorAll(".clothing-size-quantity"));
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

function showMessage(message) {
  const messageDialog = document.querySelector('message-dialog');
  messageDialog.showMessage(message);
}