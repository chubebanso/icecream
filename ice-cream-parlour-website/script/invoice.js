document.addEventListener("DOMContentLoaded", function () {
    const cartId = 15; // ID giỏ hàng cần lấy
    const token = localStorage.getItem("auth-token"); // Lấy token từ localStorage

    // Kiểm tra xem token có tồn tại không
    if (!token) {
        console.error("Token không tìm thấy trong localStorage");
        return; // Dừng nếu không có token
    }

    // Gửi yêu cầu tới API để lấy dữ liệu giỏ hàng
    fetch(`http://localhost:8080/get-all-cart-item?cart_id=${cartId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Lỗi khi lấy dữ liệu cart items");
            }
            return response.json(); // Parse JSON từ phản hồi API
        })
        .then((data) => {
            // Cập nhật dữ liệu hóa đơn
            const invoiceDate = document.getElementById("invoice-date");
            const phonenum = document.getElementById("phonenum");
            const cartIdElement = document.getElementById("cart-id");
            const total = document.getElementById("total");
            const newTotal = document.getElementById("new-total");
            const voucherName = document.getElementById("voucher-name");
            const invoiceDetails = document
                .getElementById("invoice-details")
                .getElementsByTagName("tbody")[0];

            // Dữ liệu cơ bản của giỏ hàng
            const cartData = data.cart; // Thông tin chính của giỏ hàng
            invoiceDate.textContent = cartData.createdAt || "Không xác định";
            phonenum.textContent = cartData.phonenum || "Không xác định";
            cartIdElement.textContent = cartData.id || "Không xác định";
            voucherName.textContent =
                cartData.voucher?.name || "Chưa có voucher";

            // Xóa các mục cũ trong bảng
            invoiceDetails.innerHTML = "";

            // Thêm các mặt hàng vào bảng
            let totalAmount = 0;
            data.items.forEach((item) => {
                const row = invoiceDetails.insertRow();
                row.innerHTML = `
                    <td>${item.productName || "Không xác định"}</td>
                    <td>${item.quantity || 0}</td>
                    <td>${item.price || 0} VND</td>
                    <td>${item.total || 0} VND</td>
                `;
                totalAmount += item.total || 0;
            });

            // Cập nhật tổng tiền và tổng sau khi áp dụng voucher
            total.textContent = `${cartData.total || totalAmount} VND`;
            newTotal.textContent = `${cartData.newTotal || totalAmount} VND`;
        })
        .catch((error) => console.error("Lỗi khi lấy dữ liệu cart items:", error));
});

// Lấy nút thanh toán và nút hủy từ DOM
const payNowButton = document.getElementById('payNowButton');
const cancelPaymentButton = document.getElementById('cancelPaymentButton');

// Sự kiện cho nút xác nhận thanh toán
payNowButton.addEventListener('click', () => {
    // Chuyển hướng đến trang qr.html khi xác nhận thanh toán
    window.location.href = './qr.html';
});

// Sự kiện cho nút hủy
cancelPaymentButton.addEventListener('click', () => {
    // Quay lại trang products.html khi hủy
    window.location.href = './products.html';
});
