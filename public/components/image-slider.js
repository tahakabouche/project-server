class ImageSlider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentIndex = 0;
    this.slideInterval = null;
    this._images = [];

    // Observe attributes
    this.observer = new MutationObserver(this._handleMutations.bind(this));
    this.observer.observe(this, { attributes: true, childList: true });
  }

  connectedCallback() {
    this._processImages();
    this._render();
    this._setupEventListeners();
    this._startAutoSlide();
  }

  disconnectedCallback() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.observer.disconnect();
  }

  static get observedAttributes() {
    return ["auto-slide", "slide-interval"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    if (name === "auto-slide") {
      if (newValue === "true" || newValue === "") {
        this._startAutoSlide();
      } else {
        this._stopAutoSlide();
      }
    }

    if (name === "slide-interval" && this.hasAttribute("auto-slide")) {
      this._stopAutoSlide();
      this._startAutoSlide();
    }
  }

  _handleMutations(mutations) {
    let shouldUpdate = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      this._processImages();
      this._render();
      this._setupEventListeners();
    }
  }

  _processImages() {
    this._images = [];
    const slots = this.querySelectorAll("img");

    slots.forEach((img) => {
      const src = img.getAttribute("src");
      const alt = img.getAttribute("alt") || "";
      if (src) {
        this._images.push({ src, alt });
      }
    });
  }

  _render() {
    const sliderHeight = this.getAttribute("height") || "500px";
    const thumbnailSize = this.getAttribute("thumbnail-size") || "110px";
    const thumbnailHeight = this.getAttribute("thumbnail-height") || "110px";

    const styles = `
          :host {
              display: block;
              width: 100%;
              font-family: Arial, sans-serif;
          }
          
          .slider-container {
              width: 100%;
          }
          
          .main-slider {
              position: relative;
              min-height: ${sliderHeight};
              aspect-ratio: 1 / 1;
              overflow: hidden;
              margin-bottom: 5px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .slide {
              position: absolute;
              width: 100%;
              height: 100%;
              opacity: 0;
              transition: opacity 0.5s ease-in-out;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #ddd;
          }
          
          .slide.active {
              opacity: 1;
          }
          
          .slide img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
          
          .arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              background-color: rgba(255, 255, 255, 0.7);
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              cursor: pointer;
              font-size: 1.5rem;
              z-index: 10;
              transition: all 0.3s;
          }
          
          .arrow:hover {
              background-color: rgba(255, 255, 255, 0.9);
          }
          
          .arrow-left {
              left: -50px;
          }
          
          .arrow-right {
              right: -50px;
          }
          
          .thumbnails {
              display: flex;
              gap: 10px;
              justify-content: center;
              overflow-x: auto;
              padding: 10px 0;
              scrollbar-width: thin;
          }
          
          .thumbnail {
              width: ${thumbnailSize};
              height: ${thumbnailHeight};
              border-radius: 18px;
              overflow: hidden;
              cursor: pointer;
              border: 3px solid transparent;
              transition: border-color 0.3s;
              flex-shrink: 0;
          }

          .thumbnail:hover {
             
          }
          
          .thumbnail.active {
              border-color:rgb(0, 0, 0);
          }
          
          .thumbnail img {
              width: 100%;
              height: 100%;
              object-fit: cover;
          }
          
          .thumbnails::-webkit-scrollbar {
              height: 6px;
          }
          
          .thumbnails::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
          }
          
          .thumbnails::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 10px;
          }
          
          .thumbnails::-webkit-scrollbar-thumb:hover {
              background: #aaa;
          }
      `;

    let slidesHTML = "";
    let thumbnailsHTML = "";

    this._images.forEach((image, index) => {
      const isActive = index === this.currentIndex ? "active" : "";
      slidesHTML += `
              <div class="slide ${isActive}">
                  <img src="${image.src}" alt="${image.alt}">
              </div>
          `;

      thumbnailsHTML += `
              <div class="thumbnail ${isActive}" data-index="${index}">
                  <img src="${image.src}" alt="${image.alt}">
              </div>
          `;
    });

    this.shadowRoot.innerHTML = `
          <style>${styles}</style>
          <div class="slider-container">
              <div class="main-slider">
                  ${slidesHTML}
                  <div class="arrow arrow-left">&lt;</div>
                  <div class="arrow arrow-right">&gt;</div>
              </div>
              
              <div class="thumbnails">
                  ${thumbnailsHTML}
              </div>
          </div>
      `;
  }

  _setupEventListeners() {
    const prevBtn = this.shadowRoot.querySelector(".arrow-left");
    const nextBtn = this.shadowRoot.querySelector(".arrow-right");
    const thumbnails = this.shadowRoot.querySelectorAll(".thumbnail");
    const sliderContainer = this.shadowRoot.querySelector(".slider-container");
    const mainSlider = this.shadowRoot.querySelector(".main-slider");

    // Arrow navigation
    prevBtn.addEventListener("click", () => this.previousSlide());
    nextBtn.addEventListener("click", () => this.nextSlide());

    mainSlider.addEventListener("mouseenter", () => {
      if (this._images.length > 0) {
        prevBtn.style.left = "15px";
        nextBtn.style.right = "15px";
      }
    });

    mainSlider.addEventListener("mouseleave", () => {
      prevBtn.style.left = "-50px";
      nextBtn.style.right = "-50px";
    });

    // Thumbnail navigation
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        const index = parseInt(thumbnail.getAttribute("data-index"));
        this.goToSlide(index);
      });
    });

    // Pause auto-slide on hover
    sliderContainer.addEventListener("mouseenter", () => this._stopAutoSlide());
    sliderContainer.addEventListener("mouseleave", () => {
      if (this.hasAttribute("auto-slide")) {
        this._startAutoSlide();
      }
    });

    // Keyboard navigation
    this.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.previousSlide();
      } else if (e.key === "ArrowRight") {
        this.nextSlide();
      }
    });
  }

  _startAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }

    const interval = parseInt(this.getAttribute("slide-interval")) || 5000;

    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, interval);
  }

  _stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  // Public methods
  nextSlide() {
    let newIndex = this.currentIndex + 1;
    if (newIndex >= this._images.length) newIndex = 0;
    this.goToSlide(newIndex);
  }

  previousSlide() {
    let newIndex = this.currentIndex - 1;
    if (newIndex < 0) newIndex = this._images.length - 1;
    this.goToSlide(newIndex);
  }

  goToSlide(index) {
    if (index < 0 || index >= this._images.length) return;

    const slides = this.shadowRoot.querySelectorAll(".slide");
    const thumbnails = this.shadowRoot.querySelectorAll(".thumbnail");

    // Remove active class from all slides and thumbnails
    slides.forEach((slide) => slide.classList.remove("active"));
    thumbnails.forEach((thumb) => thumb.classList.remove("active"));

    // Add active class to current slide and thumbnail
    slides[index].classList.add("active");
    thumbnails[index].classList.add("active");

    // Scroll thumbnail into view if needed
    thumbnails[index].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    this.currentIndex = index;

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("slide-change", {
        detail: { index, image: this._images[index] },
        bubbles: true,
        composed: true,
      })
    );
  }
}

// Register the custom element
customElements.define("image-slider", ImageSlider);
