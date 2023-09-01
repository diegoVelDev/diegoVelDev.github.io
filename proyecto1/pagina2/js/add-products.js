const cntCart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const products = document.getElementById("products");
let cart = [];

function handleDrop(e) {
    e.preventDefault();

    // Obtener los datos del producto que fue soltado
    const product = JSON.parse(e.dataTransfer.getData("text/json"));
    const id = product.id;

    if (!id) {
        console.error('No se encontro el producto');
        return false;
    }

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const name = product.name;
        const price = parseFloat(product.price);
        const image = product.image;

        cart.push({ id, name, price, image, quantity: 1 });
    }

    updateCart();
}


// Función para guardar el carrito en el localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para cargar el carrito desde el localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Cargar el carrito almacenado al cargar la página
loadCartFromLocalStorage();

// Función para eliminar un elemento del carrito
function removeItemFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Función para agregar un elemento al carrito
function addItemToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    for (const item of cart) {
        total += item.price * item.quantity;

        const cartItem = document.createElement("li");
        cartItem.innerHTML = `
            <div class="cart-product">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio: Q${item.price.toFixed(2)}</p>
                    <p>subtotal: Q${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item-button" data-id="${item.id}">
                    <span>&times;</span>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    }

    cartTotal.textContent = `Q${total.toFixed(2)}`;

    // Guardar el carrito actualizado en el localStorage
    saveCartToLocalStorage();

    // Agregar manejador de evento para los botones de eliminación
    const removeButtons = document.querySelectorAll(".remove-item-button");
    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemId = button.getAttribute("data-id");
            removeItemFromCart(itemId);
        });
    });
}

function handleAddToCartButtonClick(e) {
    const productCard = e.target.closest(".product-card");
    if (productCard) {
        const id = productCard.dataset.id;
        const name = productCard.dataset.name;
        const price = parseFloat(productCard.dataset.price);
        const image = productCard.dataset.image;

        const productData = {
            id,
            name,
            price,
            image
        };

        addItemToCart(productData);
    }
}

// Agregar manejador de evento para el botón de agregar al carrito en dispositivos móviles
const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
addToCartButtons.forEach(button => {
    button.addEventListener("click", handleAddToCartButtonClick);
});

cntCart.addEventListener("dragover", (e) => {
    e.preventDefault();
});

cntCart.addEventListener("drop", handleDrop);

products.addEventListener("dragstart", (e) => {
    let id = e.target.dataset.id;
    let name = e.target.dataset.name;
    let price = parseFloat(e.target.dataset.price);
    let image = e.target.dataset.image;

    // Crear un objeto con los datos del producto para ser soltado
    const productData = {
        id,
        name,
        price,
        image
    };

    // Establecer los datos como texto JSON para el arrastre
    e.dataTransfer.setData("text/json", JSON.stringify(productData));
});
