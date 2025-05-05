import { register, isAuthenticated } from "../modules/auth.js";

// Redirect if already logged in
if (isAuthenticated()) {
  window.location.href = "/";
}

const emailInput = document.getElementById("sign-up-email");
const firstnameInput = document.getElementById("sign-up-firstname");
const lastnameInput = document.getElementById("sign-up-lastname");
const passwordInput = document.getElementById("sign-up-password");
const signInBtn = document.getElementById("sign-in-btn");

// Add error box to handle errors
const errorBox = document.createElement("p");
errorBox.className = "sign-error";
errorBox.style.display = "none";
const passwordContainer = document.querySelector("#sign-up-password").parentElement;
passwordContainer.appendChild(errorBox);

function getUserFields() {
  return {
    email: emailInput.value,
    firstname: firstnameInput.value,
    lastname: lastnameInput.value,
    password: passwordInput.value,
  };
}

function validateForm() {
  let isValid = true;
  errorBox.style.display = "none";

  if (!emailInput.value) {
    errorBox.style.display = "block";
    errorBox.innerText = "Email is required";
    isValid = false;
  } else if (!firstnameInput.value) {
    errorBox.style.display = "block";
    errorBox.innerText = "First name is required";
    isValid = false;
  } else if (!lastnameInput.value) {
    errorBox.style.display = "block";
    errorBox.innerText = "Last name is required";
    isValid = false;
  } else if (!passwordInput.value) {
    errorBox.style.display = "block";
    errorBox.innerText = "Password is required";
    isValid = false;
  } else if (passwordInput.value.length < 6) {
    errorBox.style.display = "block";
    errorBox.innerText = "Password must be at least 6 characters";
    isValid = false;
  }

  return isValid;
}

signInBtn.addEventListener("click", async () => {
  if (!validateForm()) return;

  try {
    signInBtn.disabled = true;
    signInBtn.innerText = "Creating account...";
    
    const res = await register(getUserFields());
    
    // Redirect on success
    window.location.href = "/";
    
  } catch (error) {
    errorBox.style.display = "block";
    errorBox.innerText = error.message || "Registration failed. Please try again.";
    
    signInBtn.disabled = false;
    signInBtn.innerText = "Sign up";
  }
});

// Also enable form submission with Enter key
passwordInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    signInBtn.click();
  }
});
