document.addEventListener("DOMContentLoaded", function() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");
  const confirmButton = document.getElementById("confirm-button");

  function updateTotalPrice(cart) {
    let total = 0;
    cart.forEach(product => {
      const price = parseFloat(product.price);
      const quantity = parseInt(product.quantity);
      total += price * quantity;
    });
    totalPrice.textContent = "Q" + total.toFixed(2);
  }

  function updateSubtotals() {
    const quantityInputs = document.querySelectorAll(".quantity");
    const subtotalCells = document.querySelectorAll(".subtotal");

    quantityInputs.forEach((input, index) => {
      const productIndex = Array.from(quantityInputs).indexOf(input);
      const quantity = parseInt(input.value);
      const price = parseFloat(cart[productIndex].price);
      const subtotal = quantity * price;
      subtotalCells[index].textContent = "Q" + subtotal.toFixed(2);

      cart[productIndex].quantity = quantity; // Actualizar cantidad en el carrito
      localStorage.setItem("cart", JSON.stringify(cart)); // Actualizar Local Storage
    });
    updateTotalPrice(cart);
  }

  function createProductRow(product, index) {
    const row = document.createElement("tr");

    const imageCell = document.createElement("td");
    imageCell.innerHTML = `<img src="${product.image}" width="150px">`;
    row.appendChild(imageCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;
    row.appendChild(nameCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = "Q" + product.price.toFixed(2);
    row.appendChild(priceCell);

    const quantityCell = document.createElement("td");
    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.className = "quantity";
    quantityInput.value = product.quantity;
    quantityInput.min = 1;
    quantityInput.onkeydown = function(e) {
      if(!((e.keyCode > 95 && e.keyCode < 106)
          || (e.keyCode > 47 && e.keyCode < 58)
          || e.keyCode === 8)) {
        return false;
      }
    };
    quantityCell.appendChild(quantityInput);
    row.appendChild(quantityCell);

    const subtotalCell = document.createElement("td");
    subtotalCell.className = "subtotal";
    subtotalCell.textContent = "Q" + (product.price * product.quantity).toFixed(2);
    row.appendChild(subtotalCell);

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("btn-delete");

    deleteButton.addEventListener("click", function() {
      cart.splice(index, 1); // Eliminar el producto del carrito
      updateCartItems(cart);
      updateTotalPrice(cart);
      localStorage.setItem("cart", JSON.stringify(cart)); // Actualizar Local Storage
    });
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    return row;
  }

  // Obtener el carrito del Local Storage
  const savedCart = localStorage.getItem("cart");
  let cart = [];
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  function updateCartItems(cart) {
    cartItemsContainer.innerHTML = "";
    cart.forEach((product, index) => {
      const productRow = createProductRow(product, index);
      cartItemsContainer.appendChild(productRow);
    });
  }

  updateCartItems(cart);

  confirmButton.addEventListener("click", function() {
    alert("¡Compra confirmada! Total: " + totalPrice.textContent);
  });

  updateTotalPrice(cart);

  cartItemsContainer.addEventListener("input", updateSubtotals);
});
