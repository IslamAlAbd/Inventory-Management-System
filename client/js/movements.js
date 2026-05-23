const BASE_URL = "http://localhost:3000/api";

// API CALLS

const getAllMovements = async () => {
  const response = await fetch(`${BASE_URL}/movements`);
  return response.json();
};

const getAllProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  return response.json();
};

const apiAddMovement = async (movementData) => {
  try {
    const response = await fetch(`${BASE_URL}/movements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movementData),
    });
    const result = await response.json();
    if (result.warning) {
      alert(result.warning);
    }
  } catch (error) {
    console.error("Failed to add product:", error);
  }
};

const apiDeleteMovement = async (id) => {
  try {
    await fetch(`${BASE_URL}/movements/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete product:", error);
  }
};

// UI HELPERS

const closeModal = () => {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("new-movement"),
  );
  if (modal) modal.hide();
};

const resetForm = () => {
  document.getElementById("productSelect").value = "";
  document.getElementById("movementType").value = "IN";
  document.getElementById("productquantity").value = "";
  document.getElementById("movementNote").value = "";
};

const refreshTable = async () => {
  const movements = await getAllMovements();
  const products = await getAllProducts();
  renderTable(movements, products);
};
// RENDER

const renderTable = (movements, products) => {
  const tableBody = document.getElementById("movements-table-body");
  tableBody.innerHTML = "";

  if (movements.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='7'>No movements found</td></tr>";
    return;
  }

  movements.forEach((movement, index) => {
    const row = document.createElement("tr");
    const product = products.find((p) => p._id === movement.product_id);
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td><span class="status-badge" style="background-color: ${movement.type === 'IN' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${movement.type === 'IN' ? '#22c55e' : '#ef4444'}">${movement.type}</span></td>
      <td>${movement.quantity}</td>
      <td>${movement.note}</td>
      <td>${new Date(movement.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-outline-light delete-btn" data-id="${movement._id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// EVENT LISTENERS

document.getElementById("submit-btn").addEventListener("click", async () => {
  const movementData = {
    product_id: document.getElementById("productSelect").value,
    type: document.getElementById("movementType").value,
    quantity: document.getElementById("productquantity").value,
    note: document.getElementById("movementNote").value,
  };

  await apiAddMovement(movementData);
  closeModal();
  resetForm();
  await refreshTable();
});

document
  .getElementById("movements-table-body")
  .addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      await apiDeleteMovement(id);
      await refreshTable();
    }
  });

const populateDropdown = (products) => {
  const select = document.getElementById("productSelect");

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product._id;
    option.innerText = product.name;
    select.appendChild(option);
  });
};
// INIT 
const init = async () => {
  try {
    const products = await getAllProducts();
    populateDropdown(products);
    await refreshTable();
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
};

init();
