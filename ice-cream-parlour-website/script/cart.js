const cartIcon = document.querySelector(".cart-icon");
const cart = document.querySelector(".cart");
const close = document.querySelector(".close-cart");

cartIcon.addEventListener("click", () => {
    if (cart.classList.contains("active")) {
        cart.classList.remove("active");
    }
    else {
        cart.classList.add("active");
    }
})

close?.addEventListener("click", () => {
    cart.classList.remove("active");
})

// Hiển thị pop-up khi nhấn nút "Chọn Voucher"
document.getElementById("voucherBtn").addEventListener("click", function () {
    // Hiển thị pop-up
    document.getElementById("voucherPopup").style.display = "flex"; // Chuyển display từ "none" thành "flex"
});

// Hủy chọn voucher và ẩn pop-up khi nhấn "Hủy"
document.getElementById("cancelPopupBtn").addEventListener("click", function () {
    // Hủy lựa chọn tất cả các radio button
    const vouchers = document.querySelectorAll('input[name="voucher"]');
    vouchers.forEach(voucher => voucher.checked = false);

    // Ẩn pop-up
    document.getElementById("voucherPopup").style.display = "none"; // Đảm bảo pop-up bị ẩn
});

// Áp dụng voucher và ẩn pop-up khi nhấn "Áp Dụng"
document.getElementById("applyVoucherBtn").addEventListener("click", function () {
    const selectedVoucher = document.querySelector('input[name="voucher"]:checked');
    if (selectedVoucher) {
        alert(`Voucher ${selectedVoucher.value} đã được áp dụng!`);
    } else {
        alert("Vui lòng chọn voucher trước khi áp dụng.");
    }

    // Ẩn pop-up
    document.getElementById("voucherPopup").style.display = "none"; // Ẩn pop-up sau khi áp dụng
});







