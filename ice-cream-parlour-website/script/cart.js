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
const pageLimit = 9; // Số lượng voucher mỗi trang (3x3)
let currentPage = 1; // Trang hiện tại
let voucherData = []; // Dữ liệu voucher toàn bộ

// Hiển thị pop-up khi nhấn nút "Chọn Voucher"
voucherBtn.addEventListener("click", () => {
    voucherPopup.style.display = "flex"; // Chuyển display từ "none" thành "flex"
});

// Hủy chọn voucher và ẩn pop-up khi nhấn "Hủy"
cancelPopupBtn.addEventListener("click", () => {
    // Hủy lựa chọn tất cả các voucher-item
    document.querySelectorAll('.voucher-item.selected').forEach(item => {
        item.classList.remove('selected');
        const radioButton = item.querySelector('input[type="radio"]');
        if (radioButton) radioButton.checked = false; // Bỏ chọn radio button
    });

    // Ẩn pop-up
    voucherPopup.style.display = "none";
});

// Áp dụng voucher khi nhấn nút "Áp dụng"
applyVoucherBtn.addEventListener("click", async () => {
    const selectedVoucher = document.querySelector('.voucher-item.selected');
    const cartId = localStorage.getItem('cart_id'); // Lấy ID giỏ hàng từ localStorage (hoặc từ source khác)

    if (selectedVoucher && cartId) {
        const voucherId = selectedVoucher.querySelector('input[type="radio"]').value;

        try {
            // Gọi hàm applyVoucherToCart để gửi yêu cầu áp dụng voucher
            const response = await applyVoucherToCart(voucherId, cartId);

            if (response.ok) {
                // Nếu API phản hồi thành công, hiển thị thông báo
                alert(`Voucher đã được áp dụng vào giỏ hàng!`);
            }
        } catch (error) {
            // Xử lý lỗi xảy ra trong quá trình gọi API
            alert(`Có lỗi xảy ra: ${error.message}`);
        }
    } else {
        alert("Vui lòng chọn voucher trước khi áp dụng.");
    }

    // Ẩn pop-up sau khi áp dụng hoặc khi không có lựa chọn
    voucherPopup.style.display = "none";
});

// Lấy danh sách voucher từ backend khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
    async function fetchVouchers() {
        try {
            const response = await fetch('http://localhost:8080/voucher');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonResponse = await response.json();
            voucherData = jsonResponse.data; // Lưu dữ liệu voucher từ "data"
            renderVouchers(voucherData); // Render các voucher ban đầu
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    }

    function renderVouchers(vouchers) {
        console.log(vouchers); // Kiểm tra dữ liệu trong mảng voucher

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('voucher-grid');

        vouchers.forEach((voucher) => {
            console.log(voucher.voucherName); // Kiểm tra tên voucher
            const voucherItem = document.createElement('div');
            voucherItem.classList.add('voucher-item');
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

            voucherItem.addEventListener('click', () => {
                // Bỏ chọn tất cả các voucher-item khác
                document.querySelectorAll('.voucher-item.selected').forEach(item => item.classList.remove('selected'));
                
                // Chọn voucher nếu chưa được chọn
                voucherItem.classList.add('selected');
                
                // Đánh dấu radio button của voucher là checked
                const radioButton = voucherItem.querySelector('input[type="radio"]');
                if (radioButton) radioButton.checked = true;
            });

            gridContainer.appendChild(voucherItem);
        });

        voucherListElement.appendChild(gridContainer);
        updatePagination(vouchers);
    }

    // Cập nhật phân trang
    function updatePagination(vouchers) {
        const totalPages = Math.ceil(vouchers.length / pageLimit);
        const paginationElement = document.querySelector(".pagination-container");

        paginationElement.innerHTML = '';

        const pageInfo = document.getElementById("page-info");
        pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;

        const prevButton = document.getElementById("prev-page");
        const nextButton = document.getElementById("next-page");

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        prevButton.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderVouchers(voucherData);
            }
        });

        nextButton.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderVouchers(voucherData);
            }
        });
    }

    fetchVouchers();
});

/**
 * Gọi API để áp dụng voucher vào giỏ hàng
 * @param {number} voucherId - ID của voucher được chọn để áp dụng.
 * @param {number} cartId - ID của giỏ hàng hiện tại.
 * @returns {Promise<Response>} - Trả về một Promise chứa phản hồi từ server.
 */
async function applyVoucherToCart(voucherId, cartId) {
    try {
      const response = await fetch(
        `http://localhost:8080/apply-voucher-to-cart?voucher_id=${voucherId}&cart_id=${cartId}`,
        {
          method: "POST",
        }
      );
      const data = await response.text();
      if (response.ok) {
        showToast(data); // Hiển thị thông báo thành công
        updateCartDisplay(cartId); // Cập nhật giỏ hàng sau khi áp dụng voucher
      } else {
        console.error("Lỗi áp dụng voucher:", data);
        showToast("Áp dụng voucher thất bại, thử lại trong vài giây");
      }
    } catch (error) {
      console.error("API error:", error);
      showToast("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
}

