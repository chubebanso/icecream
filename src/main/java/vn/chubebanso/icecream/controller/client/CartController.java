package vn.chubebanso.icecream.controller.client;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.service.CartService;
import vn.chubebanso.icecream.util.error.IdInvalidException;

@RestController
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/cart")
    public ResponseEntity<List<Cart>> getAllCart() {
        return ResponseEntity.ok(this.cartService.getAllCart());
    }

    @GetMapping("/cart/{cart_id}")
    public ResponseEntity<Cart> getCartById(@Valid @RequestBody @PathVariable Long cart_id) {
        return ResponseEntity.ok(this.cartService.getCartById(cart_id));
    }

    @DeleteMapping("/delete/cart/{cart_id}")
    public ResponseEntity<Void> deleteCart(@Valid @PathVariable Long cart_id)
            throws IdInvalidException {
        if (cart_id > 1500) {
            throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay product");
        }
        this.cartService.deleteCartById(cart_id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create-cart")
    public ResponseEntity<Cart> createCart(@RequestParam("phone") String phone) {
        Cart createdCart = this.cartService.createCart(phone);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCart);
    }
}
