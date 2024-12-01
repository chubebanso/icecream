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
      // Lưu dữ liệu voucher vào biến toàn cục để phục vụ việc tìm kiếm
      window.vouchers = vouchers;
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
                      <p class="voucher-condition">Đơn tối thiểu: ${voucher.minActivationValue} VND</p>
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
  
  // Tìm kiếm voucher khi người dùng nhập từ khóa
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase(); // Lấy từ khóa tìm kiếm và chuyển thành chữ thường
    const filteredVouchers = window.vouchers.filter((voucher) =>
      voucher.voucherName.toLowerCase().includes(searchTerm) // Lọc voucher theo tên
    );
    
    // Hiển thị kết quả tìm kiếm
    suggestionsContainer.innerHTML = "";
    if (filteredVouchers.length > 0) {
      filteredVouchers.forEach((voucher) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion-item");
        suggestionItem.textContent = voucher.voucherName;
  
        suggestionItem.addEventListener("click", () => {
          // Khi click vào suggestion, chọn voucher đó
          selectedVoucherId = voucher.id;
          searchInput.value = voucher.voucherName; // Hiển thị tên voucher vào thanh tìm kiếm
          suggestionsContainer.innerHTML = ""; // Ẩn gợi ý
          renderVouchers([voucher]); // Render lại voucher đã chọn
        });
  
        suggestionsContainer.appendChild(suggestionItem);
      });
    } else {
      suggestionsContainer.innerHTML = "<p>Không tìm thấy voucher</p>";
    }
  });
  