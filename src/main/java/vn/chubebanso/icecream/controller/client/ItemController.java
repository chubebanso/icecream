package vn.chubebanso.icecream.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.service.CartService;
import vn.chubebanso.icecream.service.ProductService;

@RestController
public class ItemController {

    private final CartService cartService;
    private final ProductService productService;

    public ItemController(CartService cartService, ProductService productService) {
        this.cartService = cartService;
        this.productService = productService;
    }

    @PostMapping("/add-to-cart")
    public ResponseEntity<String> addProductToCart(@Valid @RequestParam("cart_id") Long cart_id,
            @Valid @RequestParam("product_id") Long product_id, @Valid @RequestParam("quantity") Long quantity) {
        Cart cart = cartService.getCartById(cart_id);
        if (cart == null) {
            return ResponseEntity.badRequest().body("Giỏ hàng không tồn tại");
        }
        Product product = productService.getProductById(product_id);
        if (product == null) {
            return ResponseEntity.badRequest().body("Sản phẩm không tồn tại");
        }        String productName = product.getName();
        this.productService.handleAddProductToCart(cart, product_id, quantity);
        return ResponseEntity.ok("Đã thêm sản phẩm " + productName + " vào giỏ hàng!");
    }

    // lấy tất cả cart item từ 1 cart
    @GetMapping("/get-all-cart-item")
    public ResponseEntity<List<CartItem>> getCartItembyCart(@Valid @RequestParam("cart_id") Long cart_id) {
        return ResponseEntity.ok(this.productService.getCartItembyCart(cart_id));
    }

    // xóa 1 item trong cart
    @DeleteMapping("/delete-item-from-cart")
    public ResponseEntity<String> deleteItemFromCart(@Valid @RequestParam("cart_id") Long cart_id,
            @Valid @RequestParam("product_id") Long product_id) {
        Cart cart = cartService.getCartById(cart_id);
        if (cart == null) {
            return ResponseEntity.badRequest().body("Giỏ hàng không tồn tại");
        }
        Product product = productService.getProductById(product_id);
        if (product == null) {
            return ResponseEntity.badRequest().body("Sản phẩm không tồn tại");
        }
        String productName = product.getName();
        this.productService.handleDeleteItemFromCart(cart, product);
        return ResponseEntity.ok("Đã xóa sản phẩm " + productName + " thành công!");
        // alo
    }

    // @DeleteMapping("/delete-product-from-cartItem/{product_id}")
    // public ResponseEntity<String>
    // findCartItemFromProduct(@PathVariable("product_id") Long product_id) {
    // this.productService.deleteProductCartItem(product_id);
    // return ResponseEntity.ok("Xóa thành công");
    // }
}
