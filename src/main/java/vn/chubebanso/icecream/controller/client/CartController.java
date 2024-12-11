package vn.chubebanso.icecream.controller.client;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.service.CartService;

@RestController
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/create-cart")
    public ResponseEntity<Cart> createCart(@Valid @RequestParam("phone") String phone) {
        Cart createdCart = this.cartService.createCart(phone);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCart);
    }

    @GetMapping("/get-cart-by-id")
    public ResponseEntity<Cart> getCartById(@Valid @RequestParam("id") long id) {
        return ResponseEntity.ok(this.cartService.showCartsById(id));
    }

    @PostMapping("/submit-cart-by-id")
    public ResponseEntity<String> submitCart(@Valid @RequestParam("cart_id") long cart_id) {
        Cart cart = cartService.getCartById(cart_id);
        if (cart == null) {
            return ResponseEntity.badRequest().body("Giỏ hàng không tồn tại");
        }
        this.cartService.submitCart(cart);
        return ResponseEntity.ok("Xác nhận giỏ hàng thành công!");
    }

    @PostMapping("/admin/pay-cart")
    public ResponseEntity<String> payCart(@Valid @RequestParam("cart_id") long cart_id,
            @RequestParam("status") String status) {
        Cart cart = cartService.getCartById(cart_id);
        if (cart == null) {
            return ResponseEntity.badRequest().body("Giỏ hàng không tồn tại");
        }
        this.cartService.update(cart, status);
        return ResponseEntity.ok("Xác nhận giỏ hàng thành công!");
    }

    @PostMapping("/admin/save-cart")
    public ResponseEntity<String> saveCartSaveStatus(@Valid @RequestParam("cart_id") long cart_id,
            @RequestParam("save_status") String saveStatus) {
        Cart cart = cartService.getCartById(cart_id);
        if (cart == null) {
            return ResponseEntity.badRequest().body("Giỏ hàng không tồn tại");
        }
        this.cartService.updateSaveStatus(cart, saveStatus);
        return ResponseEntity.ok("Xác nhận lưu giỏ hàng thành công!");
    }
}
