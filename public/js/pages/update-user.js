import "../../components/dropdown-menu.js";
import "../../components/role-dropdown-menu.js";
import "../../components/side-bar.js";
import { get, put, imageUploadRequest } from "../modules/api.js";

const userId = new URLSearchParams(window.location.search).get("id");
const pfpUpload = document.getElementById("file-upload");

const userName = document.getElementById("user-name");
const userFirstName = document.getElementById("user-first-name");
const userLastName = document.getElementById("user-last-name");
const userEmail = document.getElementById("user-email");
const userPhone = document.getElementById("user-phone");
const userPassword = document.getElementById("user-password");
const saveBtn = document.getElementById("save-user-btn");
const userPfp = document.querySelector(".user-pfp");
const userRoleMenu = document.querySelector("role-dropdown-menu");

saveBtn.addEventListener("click", updateUser);

async function populateUserFields() {
  const response = await get(`users/${userId}`);
  userName.innerText = `${response.data.firstname} ${response.data.lastname}`;
  userPfp.src = `images/${response.data.profilePicture}`;
  userFirstName.value = response.data.firstname;
  userLastName.value = response.data.lastname;
  userEmail.value = response.data.email;
  userPhone.value = response.data.phone;
  userRoleMenu.selected = response.data.role;
}

function getUserFields() {
  return {
    firstname: userFirstName.value,
    lastname: userLastName.value,
    email: userEmail.value,
    phone: userPhone.value,
    role: userRoleMenu.selected,
    password: userPassword.value,
  };
}

async function updateUser() {
  const response = await put(`users/${userId}`, getUserFields());

  if (response.success && pfpUpload.files[0]) {
    const formData = new FormData();
    formData.append("file", pfpUpload.files[0]);

    await imageUploadRequest(`auth/uploadpfp`, {
      method: "PUT",
      body: formData,
    });
  }
}

populateUserFields();
