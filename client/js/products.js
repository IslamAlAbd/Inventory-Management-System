const BASE_URL = "http://localhost:3000/api";
let editId = null;

// API CALLS 

const getAllProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  return response.json();
};

const apiAddProduct = async (productData) => {
  try {
    await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
  } catch (error) {
    console.error("Failed to add product:", error);
  }
};

const apiEditProduct = async (id, productData) => {
  try {
    await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
  } catch (error) {
    console.error("Failed to edit product:", error);
  }
};

const apiDeleteProduct = async (id) => {
  try {
    await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete product:", error);
  }
};

// UI HELPERS 

const openModal = () => {
  const modal = new bootstrap.Modal(document.getElementById("add-product"));
  modal.show();
};

const closeModal = () => {
  const modal = bootstrap.Modal.getInstance(document.getElementById("add-product"));
  if (modal) modal.hide();
};

const resetForm = () => {
  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productquantity").value = "";
  document.getElementById("productminquantity").value = "";
  document.getElementById("addProductLabel").innerText = "Add Product";
  document.getElementById("submit-btn").innerText = "Add Product";
  editId = null;
};

const refreshTable = async () => {
  const products = await getAllProducts();
  renderTable(products);
};

// RENDER

const renderTable = (products) => {
  const tableBody = document.getElementById("products-table-body");
  tableBody.innerHTML = "";

  if (products.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='7'>No products found</td></tr>";
    return;
  }

  products.forEach((product, index) => {
    const row = document.createElement("tr");
    if (product.quantity < product.min_quantity) {
      row.classList.add("low-stock");
    }
    
    const statusBadge = product.quantity < product.min_quantity 
      ? '<span class="status-badge status-low">Low Stock</span>' 
      : '<span class="status-badge status-ok">OK</span>';
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.name}</td>
      <td>$${product.price}</td>
      <td>${product.quantity}</td>
      <td>${product.min_quantity}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-outline-light edit-btn" data-id="${product._id}">Edit</button>
        <button class="btn btn-outline-light delete-btn" data-id="${product._id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};


// EVENT LISTENERS

document.getElementById("products-table-body").addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    await apiDeleteProduct(id);
    await refreshTable();
  }

  if (e.target.classList.contains("edit-btn")) {
    const products = await getAllProducts();
    const product = products.find((p) => p._id === id);

    document.getElementById("productName").value = product.name;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productquantity").value = product.quantity;
    document.getElementById("productminquantity").value = product.min_quantity;
    document.getElementById("addProductLabel").innerText = "Edit Product";
    document.getElementById("submit-btn").innerText = "Save Changes";

    editId = id;
    openModal();
  }
});

document.getElementById("submit-btn").addEventListener("click", async () => {
  const productData = {
    name: document.getElementById("productName").value,
    price: document.getElementById("productPrice").value,
    quantity: document.getElementById("productquantity").value,
    min_quantity: document.getElementById("productminquantity").value,
  };

  if (editId === null) {
    await apiAddProduct(productData);
  } else {
    await apiEditProduct(editId, productData);
  }

  closeModal();
  resetForm();
  await refreshTable();
});

// INIT 

const init = async () => {
  try {
    await refreshTable();
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
};

init();