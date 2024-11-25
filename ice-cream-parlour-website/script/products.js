document.addEventListener("DOMContentLoaded", async () => {
  const cartId = sessionStorage.getItem("cartId");
  if (!cartId) {
    console.warn("Cart ID not found in sessionStorage.");
  } else {
    console.log(`Cart ID found: ${cartId}`);
  }

  await fetchProductsFromAPI();

  const flavorId = getQueryParam("flavor");
  flavorId ? filterProducts(flavorId) : displayProducts(productsList);

  if (cartId) {
    updateCartDisplay(cartId);
  }
});

let productsList = [];

// Fetch products from API
async function fetchProductsFromAPI() {
  try {
    const response = await fetch("http://localhost:8080/product");
    const data = await response.json();

    if (data.statusCode === 200 && data.data) {
      productsList = data.data;
    } else {
      console.error("Error fetching products:", data.message);
    }
  } catch (error) {
    console.error("API error:", error);
  }
}

// Display all products
function displayProducts(products) {
  const productsSection = document.querySelector(".products-box");
  productsSection.innerHTML = "";

  if (products.length === 0) {
    productsSection.innerHTML = `
      <div class="no-product-container">
        <h1 class="no-product-heading">Không có sản phẩm nào!!</h1>
        <img src="/ice-cream-react/public/assets/images/product-not-found.png" alt="No products available" class="no-product-image">
        <p class="no-product-text">Chúng tôi xin lỗi cơ mà giờ này chắc mấy ông dev tắt server đi rồi, bảo bọn tôi để gọi dev dậy nhé!</p>
      </div>
    `;
    return;
  }

  products.forEach((product) => {
    const box = document.createElement("div");
    box.className = "box";
    box.id = product.id;

    const imagePath = `/ice-cream-react/public/assets/${product.image}`;
    box.innerHTML = `
      <div class="image-wrapper">
        <img src="${imagePath}" alt="${product.name}">
        <div class="cat-label">${product.category}</div>
        <div class="quick-view-icon"><i class="fas fa-eye"></i></div>
      </div>
      <div class="name-price">
        <div class="name">${product.name}</div>
        <div class="price">${product.price} VNĐ</div>
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

    // Quick view handler
    box
      .querySelector(".quick-view-icon")
      .addEventListener("click", () => showQuickView(product));

    // Quantity adjustment handlers
    const pcsSpan = box.querySelector(".pcs");
    box.querySelector(".increase").addEventListener("click", () => {
      pcsSpan.textContent = parseInt(pcsSpan.textContent) + 1;
    });
    box.querySelector(".decrease").addEventListener("click", () => {
      const currentQty = parseInt(pcsSpan.textContent);
      if (currentQty > 1) pcsSpan.textContent = currentQty - 1;
    });

    productsSection.appendChild(box);
  });
}

// Get query parameter from URL
function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// Filter products by category
function filterProducts(categoryId) {
  const filteredProducts =
    categoryId === "all"
      ? productsList
      : productsList.filter((product) => product.category === categoryId);
  displayProducts(filteredProducts);
}

// Show toast message
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
  const item = productsList.find((item) => item.id == productId);
  const pcs = parseInt(
    e.target.parentElement.querySelector(".pcs").textContent
  );

  const cartId = sessionStorage.getItem("cartId");
  if (!cartId) {
    showToast("Không có giỏ hàng. Hãy tạo giỏ hàng trước.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/add-to-cart?product_id=${productId}&cart_id=${cartId}&quantity=${pcs}`,
      { method: "POST" }
    );
    const message = await response.text();

    if (response.ok) {
      showToast(message);
      updateCartDisplay(cartId);
    } else {
      showToast("Thêm sản phẩm thất bại, thử lại trong vài giây");
    }
  } catch (error) {
    console.error("API error:", error);
    showToast("An error occurred. Please try again later.");
  }
}
async function updateCartDisplay(cartId) {
  try {
    const response = await fetch(
      `http://localhost:8080/get-cart-by-id?id=${cartId}`
    );
    const data = await response.json();

    if (data.statusCode === 200 && data.data) {
      const cartData = data.data;
      displayCart(cartData);
      updateCartIcon(cartData.sum);

      document.querySelector(
        ".sub-total"
      ).textContent = `${cartData.total.toFixed(2)} VNĐ`;
      if (cartData.newTotal) {
        document.querySelector(
          ".new-total"
        ).textContent = `${cartData.newTotal.toFixed(2)} VNĐ`;
      } else {
        document.querySelector(".new-total").textContent = "0 VNĐ"; // Mặc định nếu không có newTotal
      }
    } else {
      showToast("Lỗi khi lấy thông tin giỏ hàng. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Lỗi API:", error);
  }
}
// Update cart icon item count
function updateCartIcon(itemCount) {
  document.querySelector(".no-of-cart-items").textContent = itemCount;
}

// Display cart items
function displayCart(cartData) {
  const cartListItems = document.querySelector(".cart-list-items");
  cartListItems.innerHTML = "";

  if (cartData.items && cartData.items.length > 0) {
    cartData.items.forEach((item) => {
      const cartItem = document.createElement("li");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
          <div class="cart-item-image">
            <img src="/ice-cream-react/public/assets/images/${
              item.product.image
            }" alt="${item.product.name}">
          </div>
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.product.name}</h3>
            <p class="cart-item-quantity">Số lượng: ${item.productQuantity}</p>
            <p class="cart-item-subtotal">${item.subTotal.toFixed(0)} VNĐ</p>
          </div>
          <div class="cart-item-remove">
            <i class="fa fa-trash remove-item" data-product-id="${
              item.product.id
            }" aria-hidden="true"></i>
          </div>
        `;
      cartListItems.appendChild(cartItem);
    });

    // Add click event to trash icons
    document.querySelectorAll(".remove-item").forEach((icon) => {
      icon.addEventListener("click", (e) => {
        const productId = e.target.getAttribute("data-product-id");
        const cartId = sessionStorage.getItem("cartId"); // Lấy cartId từ sessionStorage

        if (!cartId) {
          console.error("Cart ID is undefined in sessionStorage.");
          showToast("Không tìm thấy giỏ hàng. Vui lòng thử lại.");
          return;
        }

        deleteCartItem(cartId, productId);
      });
    });

    document.querySelector(
      ".sub-total"
    ).textContent = `${cartData.total.toFixed(2)} VNĐ`;
    document.querySelector(".empty-cart").classList.remove("active");
    document.querySelector(".no-empty-cart").classList.add("active");
  } else {
    document.querySelector(".empty-cart").classList.add("active");
    document.querySelector(".no-empty-cart").classList.remove("active");
  }
}

// Delete item from cart
async function deleteCartItem(cartId, productId) {
  if (!cartId) {
    showToast("Không tìm thấy giỏ hàng. Vui lòng thử lại.");
    console.error("Cart ID is undefined.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/delete-item-from-cart?cart_id=${cartId}&product_id=${productId}`,
      { method: "DELETE" }
    );
    const message = await response.text();
    if (response.ok) {
      showToast(message);
      updateCartDisplay(cartId);
    } else {
      showToast("Xóa sản phẩm thất bại. Vui lòng thử lại.");
      console.error("Error deleting cart item:", message);
    }
  } catch (error) {
    console.error("API error:", error);
    showToast("Lỗi kết nối. Vui lòng thử lại sau.");
  }
}

// Cart icon click handler
document.querySelector(".cart-icon").addEventListener("click", () => {
  const cartId = sessionStorage.getItem("cartId");
  if (cartId) {
    updateCartDisplay(cartId);
  } else {
    console.log("No cartId found in sessionStorage");
  }
});
