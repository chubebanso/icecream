package vn.chubebanso.icecream.service;

// import org.springframework.stereotype.Service;

// import java.util.Optional;

// import vn.chubebanso.icecream.domain.CartItem;
// import vn.chubebanso.icecream.repository.CartItemRepository;

// @Service
// public class CartItemService {
//     private final CartItemRepository cartItemRepo;
    
//     public CartItemService(CartItemRepository cartItemRepo){
//         this.cartItemRepo = cartItemRepo;
//     }

//     public CartItem getCartItemById(Long cart_id, Long product_id) {
//         Optional<CartItem> optionalCartItem = this.cartItemRepo.findById(cart_id);
//         if (optionalCartItem.isPresent()) {
//             CartItem item = optionalCartItem.get();
//             return item;
//         } else {
//             return null;
//         }
//     }

//     public void deleteById(long cart_id) {
//         this.cartItemRepo.deleteById(cart_id);
//     }
// }
