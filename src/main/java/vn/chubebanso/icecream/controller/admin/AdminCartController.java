package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.dto.CartDTO;
import vn.chubebanso.icecream.service.CartService;

@RestController
public class AdminCartController {
    private final CartService cartService;

    public AdminCartController(CartService cartService) {
        this.cartService = cartService;
    }
    
    // Admin show all cart => mục đích thống kê/báo cáo
    @GetMapping("/cart")
    public ResponseEntity<List<CartDTO>> findAllCart() {
        return ResponseEntity.ok(this.cartService.findAllCart());
    }
}