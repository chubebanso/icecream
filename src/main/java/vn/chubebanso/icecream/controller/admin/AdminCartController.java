package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.service.CartService;
import vn.chubebanso.icecream.util.error.IdInvalidException;

@RestController
public class AdminCartController {

    private final CartService cartService;

    public AdminCartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Admin shows all carts => mục đích thống kê/báo cáo
    @GetMapping("/cart")
    public ResponseEntity<List<Cart>> findAllCart() {
        return ResponseEntity.ok(this.cartService.findAllCart());
    }

    @DeleteMapping("/cart/{cart_id}")
    public ResponseEntity<Void> deleteCart(@PathVariable("cart_id") Long cart_id)
            throws IdInvalidException {
        if (cart_id > 1500) {
            throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay cart");
        }
        this.cartService.deleteProductById(cart_id);
        return ResponseEntity.noContent().build();
    }
}
