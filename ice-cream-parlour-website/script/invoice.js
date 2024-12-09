// Lấy cartId từ sessionStorage
const cartId = sessionStorage.getItem('cartId');  // cartId sẽ được lưu trữ trong sessionStorage
// Lấy các nút xác nhận và hủy
const payNowButton = document.getElementById('payNowButton');
const cancelPaymentButton = document.getElementById('cancelPaymentButton');

// Lắng nghe sự kiện bấm nút xác nhận thanh toán
payNowButton.addEventListener('click', function () {
  // Điều hướng đến trang momo.html
  window.location.href = 'momo.html';
});

// Lắng nghe sự kiện bấm nút hủy
cancelPaymentButton.addEventListener('click', function () {
  // Điều hướng về giỏ hàng (products.html)
  window.location.href = 'products.html';
});
// Kiểm tra xem cartId có tồn tại không
if (cartId) {
  // Fetch dữ liệu từ API
  fetch(`http://localhost:8080/get-cart-by-id?id=${cartId}`)
    .then(response => response.json())
    .then(data => {
      const cart = data.data;  // Dữ liệu giỏ hàng trả về

      // Cập nhật các thông tin của hóa đơn
      document.getElementById('invoice-date').textContent = new Date(cart.createdAt).toLocaleString();
      document.getElementById('phonenum').textContent = cart.phonenum;
      document.getElementById('cart-id').textContent = cart.id;

      // Tên voucher (nếu có)
      const voucherName = cart.voucher ? cart.voucher.voucherName : "Không có voucher";
      document.getElementById('voucher-name').textContent = voucherName;

      // Tổng tiền và thành tiền
      document.getElementById('total').textContent = `${cart.total.toLocaleString()} VND`;
      document.getElementById('new-total').textContent = `${cart.newTotal.toLocaleString()} VND`;

      // Hiển thị các mặt hàng
      const invoiceItems = document.getElementById('invoice-items');
      cart.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${item.product.name}</td>
                    <td>${item.productQuantity}</td>
                    <td>${item.product.price.toLocaleString()} VND</td>
                    <td>${item.subTotal.toLocaleString()} VND</td>
                `;
        invoiceItems.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Lỗi khi lấy dữ liệu:', error);
    });
} else {
  console.error('Không tìm thấy cartId trong sessionStorage');
}
