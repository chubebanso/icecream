// package vn.chubebanso.icecream.controller.client;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RestController;

// import jakarta.validation.Valid;
// import vn.chubebanso.icecream.domain.Cart;
// import vn.chubebanso.icecream.domain.Voucher;
// import vn.chubebanso.icecream.service.CartService;
// import vn.chubebanso.icecream.service.VoucherService;

// @RestController
// public class VoucherController {

// private final VoucherService voucherService;
// private final CartService cartService;

// public VoucherController(VoucherService voucherService, CartService
// cartService) {
// this.voucherService = voucherService;
// this.cartService = cartService;
// }

// @PostMapping("/apply-voucher-to-cart")
// public ResponseEntity<String> applyVoucherToCart(@Valid
// @RequestParam("cart_id") Long cart_id,
// @RequestParam("voucher_id") Long voucher_id) {
// Cart cart = this.cartService.getCartById(cart_id);
// if (cart == null) {
// return ResponseEntity.badRequest().body("Giỏ hàng không tồn tại");
// }
// Voucher voucher = this.voucherService.getVoucherById(voucher_id);
// if (voucher == null) {
// return ResponseEntity.badRequest().body("Voucher không tồn tại");
// }
// // làm ExpiredDate nhé
// this.cartService.handleApplyVoucherToCart(cart, voucher_id);
// String voucherName = voucher.getVoucherName();
// return ResponseEntity.ok("Thêm voucher " + voucherName + " thành công!");
// }
// }