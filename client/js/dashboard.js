const BASE_URL = "http://localhost:3000/api";

const getAllProducts = async () => {
  const products = await fetch(`${BASE_URL}/products`);
  return products.json();
};
const getAllMovements = async () => {
  const response = await fetch(`${BASE_URL}/movements`);
  return response.json();
};

const init = async () => {
  try {
    const products = await getAllProducts();
    const movements = await getAllMovements();
    let totalMovements = (document.getElementById("total-movements").innerHTML =
      movements.length);
    let totalProducts = (document.getElementById("total-products").innerHTML =
      products.length);
    const lowQuantity = products.filter(
      (product) => product.quantity < product.min_quantity,
    );
    let low_quantity = (document.getElementById("low-stock").innerHTML =
      lowQuantity.length);
    renderTable(products);
  } catch (error) {
    console.error("Failed to load products:", error);
  }
};
init();

// Render users in table
const renderTable = (products) => {
  const tableBody = document.getElementById("products-table-body");
  tableBody.innerHTML = ""; // Clear existing data
  if (products.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='4'>No products found</td></tr>";
  } else {
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
        <td>${product.quantity}</td>
        <td>${statusBadge}</td>
      `;
      tableBody.appendChild(row);
    });
  }
};
