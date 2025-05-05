import "../../components/side-bar.js";

import { get, post } from "../modules/api.js";

let wilayas = [];

async function render() {
  wilayas = await getShippingRates();
  renderTable(wilayas);
}

async function getShippingRates() {
  const response = await get("shipping");

  if (!response.success) {
  }

  return response.data;
}

async function updateShippingRates() {
  console.log(wilayas);

  const response = await post("shipping", {
    shippingRates: wilayas,
  });
}

// State variables
let editingId = null;
let editingType = null; // 'stopDesk' or 'home'
let originalWilayas = [...wilayas]; // Keep a copy of the original data

// DOM Elements
const tableBody = document.getElementById("shipping-table-body");
const searchInput = document.getElementById("search-input");
const saveAllBtn = document.getElementById("save-all-btn");
const notification = document.getElementById("notification");

// Populate the table with data
function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach((wilaya) => {
    const row = document.createElement("tr");

    // ID cell
    const idCell = document.createElement("td");
    idCell.textContent = wilaya.id;
    row.appendChild(idCell);

    // Wilaya name cell
    const nameCell = document.createElement("td");
    nameCell.textContent = wilaya.state;
    row.appendChild(nameCell);

    // StopDesk shipping cost cell
    const stopDeskCell = document.createElement("td");
    stopDeskCell.className = "stopdesk-cell";

    if (editingId === wilaya.id && editingType === "stopDesk") {
      // Edit mode for StopDesk
      const editContainer = document.createElement("div");
      editContainer.className = "edit-container";

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "1";
      input.className = "edit-input";
      input.value = wilaya.stopDeskCost || 0;
      input.id = `stopdesk-cost-input-${wilaya.id}`;

      const saveBtn = document.createElement("button");
      saveBtn.className = "save-action-btn";
      saveBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      saveBtn.onclick = () => saveEdit(wilaya.id, "stopDesk");

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel-action-btn";
      cancelBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      cancelBtn.onclick = cancelEdit;

      editContainer.appendChild(input);
      editContainer.appendChild(saveBtn);
      editContainer.appendChild(cancelBtn);
      stopDeskCell.appendChild(editContainer);
    } else {
      // Display mode for StopDesk
      stopDeskCell.textContent = `${wilaya.stopDeskCost.toLocaleString()} DZD`;

      // Add edit icon if not in edit mode
      if (editingId === null) {
        const editIcon = document.createElement("button");
        editIcon.className = "edit-btn";
        editIcon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        editIcon.style.float = "right";
        editIcon.style.marginLeft = "8px";
        editIcon.onclick = () => startEdit(wilaya.id, "stopDesk");
        stopDeskCell.appendChild(editIcon);
      }
    }

    row.appendChild(stopDeskCell);

    // Home delivery shipping cost cell
    const homeCell = document.createElement("td");
    homeCell.className = "home-cell";

    if (editingId === wilaya.id && editingType === "home") {
      // Edit mode for Home Delivery
      const editContainer = document.createElement("div");
      editContainer.className = "edit-container";

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "1";
      input.className = "edit-input";
      input.value = wilaya.homeCost || 0;
      input.id = `home-cost-input-${wilaya.id}`;

      const saveBtn = document.createElement("button");
      saveBtn.className = "save-action-btn";
      saveBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      saveBtn.onclick = () => saveEdit(wilaya.id, "home");

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel-action-btn";
      cancelBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      cancelBtn.onclick = cancelEdit;

      editContainer.appendChild(input);
      editContainer.appendChild(saveBtn);
      editContainer.appendChild(cancelBtn);
      homeCell.appendChild(editContainer);
    } else {
      // Display mode for Home Delivery
      homeCell.textContent = `${wilaya.homeCost.toLocaleString()} DZD`;

      // Add edit icon if not in edit mode
      if (editingId === null) {
        const editIcon = document.createElement("button");
        editIcon.className = "edit-btn";
        editIcon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
        editIcon.style.float = "right";
        editIcon.style.marginLeft = "8px";
        editIcon.onclick = () => startEdit(wilaya.id, "home");
        homeCell.appendChild(editIcon);
      }
    }

    row.appendChild(homeCell);

   
    tableBody.appendChild(row);
  });
}

// Filter wilayas based on search input
function filterWilayas(searchTerm) {
  if (!searchTerm) {
    return wilayas;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return wilayas.filter(
    (wilaya) =>
      wilaya.state.toLowerCase().includes(lowerSearchTerm) ||
      wilaya.id.toString().includes(lowerSearchTerm)
  );
}

// Start editing a specific shipping cost type
function startEdit(id, type) {
  editingId = id;
  editingType = type;
  renderTable(filterWilayas(searchInput.value));
}

// Start editing both shipping costs (creates two rows for editing)
function startEditBoth(id) {
  editingId = id;
  editingType = "stopDesk"; // Start with StopDesk
  renderTable(filterWilayas(searchInput.value));
}

// Save edited value
function saveEdit(id, type) {
  const inputId =
    type === "stopDesk" ? `stopdesk-cost-input-${id}` : `home-cost-input-${id}`;

  const inputElement = document.getElementById(inputId);
  const newValue = parseInt(inputElement.value, 10);

  if (isNaN(newValue) || newValue < 0) {
    alert("Please enter a valid shipping cost.");
    return;
  }

  const index = wilayas.findIndex((w) => w.id === id);
  if (index !== -1) {
    if (type === "stopDesk") {
      wilayas[index].stopDeskCost = newValue;

      // If editing StopDesk first in "Edit Both" scenario, move to Home next
      if (editingId === id) {
        editingType = "home";
        renderTable(filterWilayas(searchInput.value));
        return;
      }
    } else {
      wilayas[index].homeCost = newValue;
    }
  }

  // Reset editing state
  editingId = null;
  editingType = null;
  renderTable(filterWilayas(searchInput.value));
}

// Cancel editing
function cancelEdit() {
  editingId = null;
  editingType = null;
  renderTable(filterWilayas(searchInput.value));
}

// Show notification
function showNotification() {
  notification.style.display = "flex";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

// Save all changes
async function saveAllChanges() {
  await updateShippingRates();
  originalWilayas = [...wilayas];
  showNotification();
}

// Event listeners
searchInput.addEventListener("input", () => {
  renderTable(filterWilayas(searchInput.value));
});

saveAllBtn.addEventListener("click", saveAllChanges);

render();
