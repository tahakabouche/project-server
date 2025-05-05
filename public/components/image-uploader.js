import { del } from "../js/modules/api.js";

class ImageUploader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.uploadedImages = [];
    window.uploadedImages = this.uploadedImages;

    this.render();
    this.setupElements();
    this.addEventListeners();
    this.updateNoImagesMessage();
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          
          :host {
            display: block;
           
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 2rem;
          }
          
          .uploader {
            display: flex;
            flex-direction: column; 
            gap: 2rem;
          }
          
          .drop-area {
            border: 2px dashed rgb(109, 109, 109);
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .drop-area.active {
            border-color: #3b82f6;
            background-color: #eff6ff;
          }
          
          .drop-area-text {
            margin-bottom: 15px;
            color: #4b5563;
          }
          
          .drop-area-icon {
            font-size: 40px;
            color: #9ca3af;
            margin-bottom: 15px;
          }
          
          .file-input {
            display: none;
          }
          
          .select-button {
            background-color:rgb(0, 0, 0);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 15px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          
          .select-button:hover {
            background-color:rgba(0, 0, 0, 0.7);
          }
          
          .helper-text {
            font-size: 12px;
            color: #6b7280;
            margin-top: 10px;
          }
          
          .error-message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 6px;
            background-color: #fee2e2;
            color: #b91c1c;
            display: none;
          }
          
          .preview-container {
            margin-top: 30px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
          }
          
          .preview-item {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            background-color: white;
            position: relative;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .preview-image {
            width: 100%;
            height: 140px;
            object-fit: cover;
            display: block;
          }
          
          .preview-details {
            padding: 10px;
          }
          
          .file-name {
            font-size: 14px;
            color: #111827;
            margin-bottom: 5px;
            word-break: break-all;
            max-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .file-size {
            font-size: 12px;
            color: #6b7280;
          }
          
          .delete-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          
          .delete-button:hover {
            background-color: rgba(0, 0, 0, 0.7);
          }
          
          .no-images-message {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-style: italic;
            display: none;
          }
        </style>
        
        <div class="container">
          <div class="uploader">
            <div> 
                <div id="error-message" class="error-message"></div>
                
                <div id="no-images-message" class="no-images-message">
                No images uploaded yet
                </div>
                
                <div id="preview-container" class="preview-container"></div>
            </div>
            <div id="drop-area" class="drop-area">
              <div class="drop-area-icon">📁</div>
              <div class="drop-area-text">
                <strong>Drag & drop images here</strong>
                <p>or</p>
              </div>
              <input type="file" id="file-input" class="file-input" accept="image/*" multiple>
              <button id="select-button" class="select-button">Select Images</button>
              <p class="helper-text">Supports: JPG, PNG, GIF, WEBP</p>
            </div>
            
          </div>
        </div>
      `;
  }

  setupElements() {
    this.dropArea = this.shadowRoot.getElementById("drop-area");
    this.fileInput = this.shadowRoot.getElementById("file-input");
    this.selectButton = this.shadowRoot.getElementById("select-button");
    this.errorMessage = this.shadowRoot.getElementById("error-message");
    this.previewContainer = this.shadowRoot.getElementById("preview-container");
    this.noImagesMessage = this.shadowRoot.getElementById("no-images-message");
  }

  addEventListeners() {
    // Handle click on select button
    this.selectButton.addEventListener("click", () => {
      this.fileInput.click();
    });

    // Prevent default behaviors for drag events
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      this.dropArea.addEventListener(
        eventName,
        this.preventDefaults.bind(this),
        false
      );
      document.body.addEventListener(
        eventName,
        this.preventDefaults.bind(this),
        false
      );
    });

    // Highlight drop area when dragging over it
    ["dragenter", "dragover"].forEach((eventName) => {
      this.dropArea.addEventListener(
        eventName,
        this.highlight.bind(this),
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      this.dropArea.addEventListener(
        eventName,
        this.unhighlight.bind(this),
        false
      );
    });

    // Handle file selection via drag & drop
    this.dropArea.addEventListener("drop", this.handleDrop.bind(this), false);

    // Handle file selection via file input
    this.fileInput.addEventListener("change", (e) => {
      this.handleFiles(e.target.files);
    });
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  highlight() {
    this.dropArea.classList.add("active");
  }

  unhighlight() {
    this.dropArea.classList.remove("active");
  }

  handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    this.handleFiles(files);
  }

  handleFiles(files) {
    // Clear previous errors
    this.errorMessage.style.display = "none";
    this.errorMessage.textContent = "";

    // Check if files are present
    if (files.length === 0) return;

    // Convert FileList to array
    const fileArray = Array.from(files);

    // Validate file types
    const invalidFiles = fileArray.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      return !validTypes.includes(file.type);
    });

    if (invalidFiles.length > 0) {
      this.showError("Only JPG, PNG, GIF and WEBP files are allowed");
      return;
    }

    // Process files
    fileArray.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageData = {
          id: this.generateUniqueId(),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target.result,
          file: file,
        };

        this.uploadedImages.push(imageData);
        this.renderPreview(imageData);

        // Dispatch event with new image data
        this.dispatchEvent(
          new CustomEvent("image-added", {
            detail: { image: imageData },
            bubbles: true,
            composed: true,
          })
        );

        this.updateNoImagesMessage();
      };

     console.log(window.uploadedImages.length);
      
      reader.readAsDataURL(file);
    });
  }

  renderPreview(imageData) {
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    previewItem.dataset.id = imageData.id;

    previewItem.innerHTML = `
        <img class="preview-image" src="${imageData.dataUrl}" alt="${
      imageData.name
    }">
        <button class="delete-button" data-id="${imageData.id}">×</button>
        <div class="preview-details">
          <div class="file-name">${imageData.name}</div>
          <div class="file-size">${this.formatFileSize(imageData.size)}</div>
        </div>
      `;

    this.previewContainer.appendChild(previewItem);

    // Add event listener to delete button
    const deleteButton = previewItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
      this.deleteImage(imageData.id);
    });
  }

  deleteImage(id) {
    // Find the image before removing it
    const imageToDelete = this.uploadedImages.find((img) => img.id === id);

    // Remove from array
    this.uploadedImages = this.uploadedImages.filter((img) => img.id !== id);

    // Remove from DOM
    const previewItem = this.shadowRoot.querySelector(
      `.preview-item[data-id="${id}"]`
    );
    if (previewItem) {
      this.previewContainer.removeChild(previewItem);
    }

    this.updateNoImagesMessage();

    // Dispatch event about deleted image
    if (imageToDelete) {
      this.dispatchEvent(
        new CustomEvent("image-deleted", {
          detail: { imageId: id, image: imageToDelete },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  updateNoImagesMessage() {
    console.log(this.uploadedImages.length);

    if (this.uploadedImages.length === 0) {
      this.noImagesMessage.style.display = "block";
    } else {
      this.noImagesMessage.style.display = "none";
    }

    // Dispatch event about current images
    this.dispatchEvent(
      new CustomEvent("images-updated", {
        detail: { images: [...this.uploadedImages] },
        bubbles: true,
        composed: true,
      })
    );
  }

  formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " bytes";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
  }

  generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // Public API methods
  getImages() {
    return [...this.uploadedImages];
  }

  clearImages() {
    this.uploadedImages = [];
    this.previewContainer.innerHTML = "";
    this.updateNoImagesMessage();
  }
}

// Define the custom element
customElements.define("image-uploader", ImageUploader);
