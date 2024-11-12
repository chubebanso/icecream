// Hiển thị pop-up tự động khi trang được tải
window.onload = function () {
  document.getElementById("popup").style.display = "flex";
};

// Đóng pop-up khi người dùng bấm vào nút "đóng"
document.querySelectorAll(".close-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
  });
});

// Xử lý khi form được submit
document
  .getElementById("emailForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    const phone = document.getElementById("popup-email").value; // Lấy số điện thoại từ input

    if (phone) {
      try {
        // Gửi yêu cầu API để tạo giỏ hàng mới với số điện thoại
        const response = await fetch(
          `http://localhost:8080/create-cart?phone=${phone}`,
          {
            method: "POST",
          }
        );

        if (response.ok) {
          const data = await response.json(); // Chuyển phản hồi thành dữ liệu JSON
          const cartId = data.data?.id; // Lấy id của giỏ hàng từ trường `data.id`

          // Kiểm tra và hiển thị thông báo thành công với ID giỏ hàng
          if (cartId) {
            alert(`Giỏ hàng đã được tạo thành công với ID: ${cartId}`);
            document.getElementById("popup").style.display = "none";
            // Lưu `cartId` vào sessionStorage để dùng trong các trang khác nếu cần
            sessionStorage.setItem("cartId", cartId);
          } else {
            alert(
              "Tạo giỏ hàng không thành công. Không nhận được ID giỏ hàng."
            );
          }
        } else {
          alert("Tạo giỏ hàng không thành công. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi tạo giỏ hàng:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  });

// Xử lý khi người dùng bấm vào "Không, cảm ơn"
document
  .querySelector(".no-thanks")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("popup").style.display = "none";
  });
