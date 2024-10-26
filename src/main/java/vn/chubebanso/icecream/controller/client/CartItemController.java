// package vn.chubebanso.icecream.controller.client;

// import java.util.List;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RestController;

// import jakarta.validation.Valid;
// import vn.chubebanso.icecream.domain.Cart;
// import vn.chubebanso.icecream.domain.CartItem;
// import vn.chubebanso.icecream.service.CartItemService;
// import vn.chubebanso.icecream.service.CartService;
// import vn.chubebanso.icecream.service.ProductService;
// import vn.chubebanso.icecream.util.error.IdInvalidException;


// @RestController
// public class CartItemController {
//     private final CartItemService cartItemService;

//     public CartItemController(CartItemService cartItemService) {
//         this.cartItemService = cartItemService;
//     }

//     @GetMapping("/cart-item/{cart_id}/product/{product_id}")
//     public ResponseEntity<CartItem> getCartItemById(@Valid @RequestBody @PathVariable Long cart_id, @PathVariable Long product_id) {
//         return ResponseEntity.ok(this.cartItemService.getCartItemById(cart_id, product_id));
//     }
    
//     @PostMapping("/create/cart-item")
//     public ResponseEntity<CartItem> createCartController(@Valid @RequestBody CartItem cartItem) {
//         CartItem newCartItem = this.cartItemService.handleCreateCartItem(cartItem);
//         return ResponseEntity.ok(newCartItem);
//     }
    
//     @PutMapping("/update/cart-item/{cart_id}")
//     public ResponseEntity<Cart> updateCartInfo(@Valid @RequestBody Cart cart, @PathVariable Long cart_id) {
//         return ResponseEntity.ok(this.cartItemService.updateCartItem(cart_id, cart));
//     }

//     @DeleteMapping("/delete/cart-item/{cart_id}")
//     public ResponseEntity<Void> deleteCartItem(@Valid @PathVariable Long cart_id)
//             throws IdInvalidException {
//         if (cart_id > 1500) {
//             throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay product");
//         }
//         this.cartItemService.deleteCartItemById(cart_id);
//         return ResponseEntity.noContent().build();
//     }
// }
