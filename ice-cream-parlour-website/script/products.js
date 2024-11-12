// Fetch product list and initialize cart functionality on page load
document.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsFromAPI();

  const flavor_id = getQueryParam("flavor");
  if (flavor_id) {
    filterProducts(flavor_id);
  } else {
    displayProducts(products_list);
  }

  // Update cart display on page load
  const cartId = sessionStorage.getItem("cartId");
  if (cartId) {
    updateCartDisplay(cartId);
  }
});

// Global variables
let products_list = [];

// Fetch products from API
async function fetchProductsFromAPI() {
  try {
    const response = await fetch("http://localhost:8080/product");
    const data = await response.json();
    if (data.statusCode === 200 && data.data) {
      products_list = data.data;
    } else {
      console.error("Error fetching products:", data.message);
    }
  } catch (error) {
    console.error("API error:", error);
  }
}

// Display product list
function displayProducts(products) {
  const productsSection = document.querySelector(".products-box");
  productsSection.innerHTML = ""; // Clear previous content

  if (products.length === 0) {
    productsSection.innerHTML = `
      <div class="no-product-container">
        <h1 class="no-product-heading">No Product Found</h1>
        <img src="images/product-not-found.png" alt="No products available" class="no-product-image">
        <p class="no-product-text">We're sorry, but it seems we can't find the product you're looking for. Try searching for another flavor!</p>
      </div>
    `;
    return;
  }

  products.forEach((product) => {
    const box = document.createElement("div");
    box.className = "box";
    box.id = product.id;

    const imagePath = `images/${product.image}`;
    box.innerHTML = `
      <div class="image-wrapper">
        <img src="${imagePath}" alt="${product.name}">
        <div class="cat-label">${product.category}</div>
        <div class="quick-view-icon"><i class="fas fa-eye"></i></div>
      </div>
      <div class="name-price">
        <div class="name">${product.name}</div>
        <div class="price">$${product.price}</div>
      </div>
      <div class="qty">
        <span class="decrease">-</span>
        <span class="pcs">1</span>
        <span class="increase">+</span>
      </div>
    `;

    const addToCartButton = document.createElement("button");
    addToCartButton.textContent = "Thêm vào giỏ hàng";
    addToCartButton.addEventListener("click", (e) => addToCart(e, product.id));
    box.appendChild(addToCartButton);

    // Quick view event
    box
      .querySelector(".quick-view-icon")
      .addEventListener("click", () => showQuickView(product));

    // Quantity increase and decrease events
    const pcsSpan = box.querySelector(".pcs");
    box
      .querySelector(".increase")
      .addEventListener(
        "click",
        () => (pcsSpan.textContent = parseInt(pcsSpan.textContent) + 1)
      );
    box.querySelector(".decrease").addEventListener("click", () => {
      const currentQty = parseInt(pcsSpan.textContent);
      if (currentQty > 1) pcsSpan.textContent = currentQty - 1;
    });

    productsSection.appendChild(box);
  });
}

// Get query parameter from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Filter products by category
function filterProducts(categoryId) {
  const productsToDisplay =
    categoryId === "all"
      ? products_list
      : products_list.filter((product) => product.category === categoryId);
  displayProducts(productsToDisplay);
}

// Display toast message
function showToast(message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 5500);
}

// Add product to cart
async function addToCart(e, productId) {
  const item = products_list.find((item) => item.id == productId);
  const pcs = parseInt(
    e.target.parentElement.querySelector(".pcs").textContent
  );

  if (!pcs) {
    showToast("Please select the number of cups you want!");
    return;
  }

  const cartId = sessionStorage.getItem("cartId");
  if (!cartId) {
    showToast("Không có giỏ hàng. Hãy tạo giỏ hàng trước.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/add-to-cart?product_id=${productId}&cart_id=${cartId}&quantity=${pcs}`,
      {
        method: "POST",
      }
    );
    const data = await response.text();
    if (response.ok) {
      showToast(data);
      e.target.textContent = "Bạn đã thêm sản phẩm này vào giỏ hàng rồi? Thèm ăng típ rồi saooo?";
      updateCartDisplay(cartId); // Update cart display after adding item
    } else {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", data);
      showToast("Thêm sản phẩm thất bại, thử lại trong vài giây");
    }
  } catch (error) {
    console.error("API error:", error);
    showToast("An error occurred. Please try again later.");
  }
}

// Fetch and display cart information
async function updateCartDisplay(cartId) {
  try {
    const response = await fetch(
      `http://localhost:8080/get-cart-by-id?id=${cartId}`
    );
    const data = await response.json();
    if (data.statusCode === 200 && data.data) {
      displayCart(data.data);
      updateCartIcon(data.data.sum); // Update the cart icon with the item count
    } else {
      console.error("Error fetching cart:", data.message);
    }
  } catch (error) {
    console.error("API error:", error);
  }
}

// Update cart icon with the number of items
function updateCartIcon(itemCount) {
  document.querySelector(".no-of-cart-items").textContent = itemCount;
}

// Display cart
function displayCart(cartData) {
  const cartListItems = document.querySelector(".cart-list-items");
  cartListItems.innerHTML = "";

  if (cartData.items && cartData.items.length > 0) {
    cartData.items.forEach((item) => {
      const cartItem = document.createElement("li");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-image"><img src="images/${
          item.product.image
        }" alt="${item.product.name}"></div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.product.name}</h3>
          <p class="cart-item-quantity">Quantity: ${item.productQuantity}</p>
          <p class="cart-item-subtotal">$${item.subTotal.toFixed(2)}</p>
        </div>
        <div class="cart-item-remove"><i class="fa fa-trash remove-item" aria-hidden="true"></i></div>
      `;
      cartItem
        .querySelector(".remove-item")
        .addEventListener("click", () => removeCartItem(item.id));
      cartListItems.appendChild(cartItem);
    });
    document.querySelector(
      ".sub-total"
    ).textContent = `$${cartData.total.toFixed(2)}`;
    document.querySelector(".empty-cart").classList.remove("active");
    document.querySelector(".no-empty-cart").classList.add("active");
  } else {
    document.querySelector(".empty-cart").classList.add("active");
    document.querySelector(".no-empty-cart").classList.remove("active");
  }
}

// Handle click on cart icon to update cart display
document.querySelector(".cart-icon").addEventListener("click", () => {
  const cartId = sessionStorage.getItem("cartId");
  if (cartId) {
    updateCartDisplay(cartId);
  } else {
    console.log("No cartId found in sessionStorage");
  }
});
