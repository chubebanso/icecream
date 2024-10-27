package vn.chubebanso.icecream.controller.client;

import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.service.CartService;
import vn.chubebanso.icecream.service.ProductService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class ItemController {
    private final CartService cartService;
    private final ProductService productService;

    public ItemController(CartService cartService, ProductService productService) {
        this.cartService = cartService;
        this.productService = productService;
    }

    @PostMapping("/add-to-cart")
    public ResponseEntity<String> addProductToCart(@RequestParam("cart_id") Long cartId,
            @RequestParam("product_id") Long productId) {
        Cart cart = cartService.getCartById(cartId);
        if (cart == null) {
            return ResponseEntity.badRequest().body("Giỏ hàng không tồn tại");
        }
        Product product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.badRequest().body("Sản phẩm không tồn tại");
        }
        this.productService.handleAddProductToCart(cart, productId);
        return ResponseEntity.ok("Đã thêm sản phẩm vào giỏ hàng");
    }

}
