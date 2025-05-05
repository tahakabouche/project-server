import { login, isAuthenticated } from "../modules/auth.js";
/*
// Redirect if already logged in
if (isAuthenticated()) {
  window.location.href = "/";
}
*/
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const signInBtn = document.getElementById("sign-in-btn");
const errorBox = document.querySelector(".sign-error");

function getUserFields() {
  return {
    email: emailInput.value,
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
  } else if (!passwordInput.value) {
    errorBox.style.display = "block";
    errorBox.innerText = "Password is required";
    isValid = false;
  }

  return isValid;
}

signInBtn.addEventListener("click", async () => {
  if (!validateForm()) return;

  try {
    // Test localStorage to ensure it's working
    try {
      localStorage.setItem("test_key", "test_value");
      const testValue = localStorage.getItem("test_key");
      localStorage.removeItem("test_key");
      console.log("Test localStorage:", testValue);
    } catch (storageError) {
      console.error("LocalStorage error:", storageError);
      errorBox.style.display = "block";
      errorBox.innerText =
        "Your browser doesn't support or blocks localStorage. Please enable cookies.";
      return;
    }

    signInBtn.disabled = true;
    signInBtn.innerText = "Signing in...";

    const res = await login(getUserFields());

    // Simply redirect on success - we already checked for errors in login()
    window.location.href = "/";
  } catch (error) {
    errorBox.style.display = "block";
    errorBox.innerText = error.message || "Login failed. Please try again.";

    signInBtn.disabled = false;
    signInBtn.innerText = "Sign in";
  }
});

// Also enable form submission with Enter key
passwordInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    signInBtn.click();
  }
});
