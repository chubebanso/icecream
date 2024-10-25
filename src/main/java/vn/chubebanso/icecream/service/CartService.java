package vn.chubebanso.icecream.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.repository.CartRepository;

@Service
public class CartService {
    private final CartRepository cartRepo;

    public CartService (CartRepository cartRepo){
        this.cartRepo = cartRepo;
    }

    public Cart handleCreateCart(Cart cart) {
        return this.cartRepo.save(cart);
    }

    public List<Cart> getAllCart() {
        return this.cartRepo.findAll();
    }

    public Cart getCartById(Long cart_id) {
        Optional<Cart> optionalCart = this.cartRepo.findById(cart_id);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            return cart;
        } else {
            return null;
        }
    }

    public Cart updateCart(Long cart_id, Cart cart){
        Optional<Cart> optionalCart = this.cartRepo.findById(cart_id);
        if (optionalCart.isPresent()) {        
            optionalCart.get().setDescription(cart.getDescription());
            return this.cartRepo.save(optionalCart.get());
        } else {
            return null;
        }
    }

    public void deleteCartById(Long cart_id){
        this.cartRepo.deleteById(cart_id);
    }
}
