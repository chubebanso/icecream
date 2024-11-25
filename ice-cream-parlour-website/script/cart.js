// Quản lý hiển thị giỏ hàng
const cartIcon = document.querySelector(".cart-icon");
const cart = document.querySelector(".cart");
const close = document.querySelector(".close-cart");

// Hiển thị hoặc ẩn giỏ hàng khi nhấn vào biểu tượng giỏ hàng
cartIcon.addEventListener("click", () => {
  cart.classList.toggle("active");
});

// Đóng giỏ hàng khi nhấn vào nút đóng
close?.addEventListener("click", () => {
  cart.classList.remove("active");
});

// Quản lý hiển thị voucher pop-up
const voucherPopup = document.getElementById("voucherPopup");
const applyVoucherBtn = document.getElementById("applyVoucherBtn");
const cancelPopupBtn = document.getElementById("cancelPopupBtn");
const voucherBtn = document.getElementById("voucherBtn");
const voucherListElement = document.getElementById("voucherList");
let selectedVoucherId = null; // Biến để lưu ID của voucher được chọn

// Hiển thị pop-up khi nhấn nút "Chọn Voucher"
voucherBtn.addEventListener("click", () => {
  voucherPopup.style.display = "flex"; // Chuyển display từ "none" thành "flex"
});

// Hủy chọn voucher và ẩn pop-up khi nhấn "Hủy"
cancelPopupBtn.addEventListener("click", () => {
  selectedVoucherId = null; // Xóa voucher đã chọn
  document.querySelectorAll(".voucher-item.selected").forEach((item) => {
    item.classList.remove("selected");
    const radioButton = item.querySelector('input[type="radio"]');
    if (radioButton) radioButton.checked = false; // Bỏ chọn radio button
  });

  // Ẩn pop-up
  voucherPopup.style.display = "none";
});

// Lấy danh sách voucher từ backend khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  async function fetchVouchers() {
    try {
      const response = await fetch("http://localhost:8080/voucher");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      const voucherData = jsonResponse.data; // Lưu dữ liệu voucher từ "data"
      renderVouchers(voucherData); // Render các voucher ban đầu
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  }

  function renderVouchers(vouchers) {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("voucher-grid");

    vouchers.forEach((voucher) => {
      const voucherItem = document.createElement("div");
      voucherItem.classList.add("voucher-item");
      voucherItem.dataset.voucherName = voucher.voucherName; // Lưu tên voucher vào dataset

      // Render HTML của voucher
      voucherItem.innerHTML = `
        <div class="voucher-card">
            <div class="voucher-header">
                <img src="/ice-cream-react/public/assets/images/thuytalogo.jpg" alt="Logo" class="voucher-logo">
                <div class="voucher-info">
                    <h3 class="voucher-title">${voucher.voucherName}</h3>
                    <p class="voucher-discount">${voucher.voucherType}: Giảm ${voucher.discountAmount} %</p>
                    <p class="voucher-condition">Đơn tối thiểu: ${voucher.minActivationValue} VNĐ</p>
                </div>
                <input type="radio" name="voucher" value="${voucher.id}" class="voucher-select"> <!-- ID của voucher -->
            </div>
            <div class="voucher-footer">
                <p class="voucher-used">HSD: ${voucher.expiredDate}</p>
            </div>
        </div>
      `;

      // Lắng nghe sự kiện click vào từng voucher
      voucherItem.addEventListener("click", () => {
        // Bỏ chọn tất cả các voucher-item khác
        document
          .querySelectorAll(".voucher-item.selected")
          .forEach((item) => item.classList.remove("selected"));

        // Đánh dấu voucher được chọn
        voucherItem.classList.add("selected");

        // Lấy ID của voucher được chọn và lưu vào biến
        selectedVoucherId = voucherItem.querySelector(
          'input[type="radio"]'
        ).value;
        console.log(
          `Voucher được chọn: ${voucher.voucherName} (ID: ${selectedVoucherId})`
        );
      });

      gridContainer.appendChild(voucherItem);
    });

    voucherListElement.appendChild(gridContainer);
  }

  fetchVouchers();
});

// Áp dụng voucher khi nhấn nút "Áp dụng"
applyVoucherBtn.addEventListener("click", async () => {
  const cartId = sessionStorage.getItem("cartId"); // Lấy ID giỏ hàng từ sessionStorage

  if (selectedVoucherId && cartId) {
    try {
      const response = await fetch(
        `http://localhost:8080/apply-voucher-to-cart?voucher_id=${selectedVoucherId}&cart_id=${cartId}`,
        {
          method: "POST",
        }
      );
      const data = await response.text();
      if (response.ok) {
        console.log(`Voucher đã áp dụng thành công: ${data}`);
        alert(`Voucher đã được áp dụng: ${data}`);
      } else {
        console.error("Lỗi áp dụng voucher:", data);
        alert("Áp dụng voucher thất bại, thử lại sau.");
      }
    } catch (error) {
      console.error("API error:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  } else {
    alert("Vui lòng chọn voucher trước khi áp dụng.");
  }

  // Ẩn pop-up sau khi áp dụng
  voucherPopup.style.display = "none";
});
