import "../../components/dropdown-menu.js";
import "../../components/role-dropdown-menu.js";
import "../../components/side-bar.js";
import "../../components/message-dialog.js";
import { get, put, imageUploadRequest } from "../modules/api.js";

const userId = new URLSearchParams(window.location.search).get("id");
const pfpUpload = document.getElementById("file-upload");

const userName = document.getElementById("user-name");
const userFirstName = document.getElementById("user-first-name");
const userLastName = document.getElementById("user-last-name");
const userEmail = document.getElementById("user-email");
const userPhone = document.getElementById("user-phone");
const currentUserPassword = document.getElementById("current-user-password");
const newUserPassword = document.getElementById("new-user-password");
const saveBtn = document.getElementById("save-user-btn");
const userPfp = document.querySelector(".user-pfp");

saveBtn.addEventListener("click", updateUser);

async function populateUserFields() {
  const response = await get(`auth/me`);
  userName.innerText = `${response.data.firstname} ${response.data.lastname}`;
  userPfp.src = `images/${response.data.profilePicture}`;
  userFirstName.value = response.data.firstname;
  userLastName.value = response.data.lastname;
  userEmail.value = response.data.email;
  userPhone.value = response.data.phone;
}

function getUserFields() {
  return {
    firstname: userFirstName.value,
    lastname: userLastName.value,
    email: userEmail.value,
    phone: userPhone.value,
    currentPassword: currentUserPassword.value,
    newPassword: newUserPassword.value,
  };
}

async function updateUser() {
  try {
    const response = await put(`auth/updatedetails`, getUserFields());

    if (response.success && pfpUpload.files[0]) {
      const formData = new FormData();
      formData.append("file", pfpUpload.files[0]);
  
      await imageUploadRequest(`auth/uploadpfp`, {
        method: "PUT",
        body: formData,
      });
    }

    showMessage("Your info was updated successfully");
  } catch (error) {
    showMessage(`There was an error while updating your info`);
  }
 
}

populateUserFields();

function showMessage(message) {
  const messageDialog = document.querySelector('message-dialog');
  messageDialog.showMessage(message);
}

pfpUpload.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      userPfp.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
});