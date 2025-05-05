const slideButtons = Array.from(document.querySelectorAll('input[name="radio-btn"]'));
const nextSlideBtn = document.querySelector(".next");
const prevSlideBtn = document.querySelector(".prev");

function getCurrentSlideIndex() {
  return slideButtons.findIndex((element) => element.checked === true);
}

function updateSlideButton(element) {
  slideButtons.forEach((element) =>
    element.labels[0].classList.remove("clicked-slider-btn")
  );
  element.classList.add("clicked-slider-btn");
}

function showSlideButton() {
  if (slideButtons.length > 1) {
    nextSlideBtn.classList.add("next-hovered");
    prevSlideBtn.classList.add("prev-hovered");
  }
}

function hideSlideButton() {
  nextSlideBtn.classList.remove("next-hovered");
  prevSlideBtn.classList.remove("prev-hovered");
}

function prevSlide() {
  let currentIndex = getCurrentSlideIndex();
  console.log(currentIndex);

  if (currentIndex > 0) {
    slideButtons[currentIndex - 1].checked = true;
    slideButtons[currentIndex - 1].labels[0].classList.add(
      "clicked-slider-btn"
    );
    slideButtons[currentIndex].checked = false;
    slideButtons[currentIndex].labels[0].classList.remove("clicked-slider-btn");
  } else {
    slideButtons[0].labels[0].classList.remove("clicked-slider-btn");
    slideButtons[3].checked = true;
    slideButtons[3].labels[0].classList.add("clicked-slider-btn");
  }
}

function nextSlide() {
  let currentIndex = getCurrentSlideIndex();
  console.log(currentIndex);
  if (currentIndex < 3) {
    slideButtons[currentIndex + 1].checked = true;
    slideButtons[currentIndex + 1].labels[0].classList.add(
      "clicked-slider-btn"
    );
    slideButtons[currentIndex].checked = false;
    slideButtons[currentIndex].labels[0].classList.remove("clicked-slider-btn");
  } else {
    slideButtons[3].labels[0].classList.remove("clicked-slider-btn");
    slideButtons[0].checked = true;
    slideButtons[0].labels[0].classList.add("clicked-slider-btn");
  }
}
