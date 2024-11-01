package vn.chubebanso.icecream.controller.client;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.service.CartService;

import org.springframework.web.bind.annotation.GetMapping;


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

    // show tất cả các carts của khách => khách biết mình đã từng ăn gì đặt lại cho dễ
    @GetMapping("/show-all-carts")
    public ResponseEntity<List<Cart>> showAllCarts(@RequestParam("phone") String phone) {
        return ResponseEntity.ok(this.cartService.showAllCarts(phone));
    }
    
}
