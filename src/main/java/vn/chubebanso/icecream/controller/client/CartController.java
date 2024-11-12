package vn.chubebanso.icecream.controller.client;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    @PostMapping("/create-cart")
    public ResponseEntity<Cart> createCart(@Valid @RequestParam("phone") String phone) {
        Cart createdCart = this.cartService.createCart(phone);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCart);
    }

    @DeleteMapping("/cart/{cart_id}")
    public ResponseEntity<Void> deleteCart(@PathVariable("product_id") Long cart_id)
            throws IdInvalidException {
        if (cart_id > 1500) {
            throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay cart");
        }
        this.cartService.deleteProductById(cart_id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-cart-by-id")
    public ResponseEntity<Cart> getCartByid(@Valid @RequestParam("id") Long id) {
        return ResponseEntity.ok(this.cartService.showCartsById(id));
    }
}
