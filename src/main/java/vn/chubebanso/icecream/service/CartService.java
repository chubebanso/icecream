package vn.chubebanso.icecream.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.dto.CartDTO;
import vn.chubebanso.icecream.dto.CartItemDTO;
import vn.chubebanso.icecream.repository.CartItemRepository;
import vn.chubebanso.icecream.repository.CartRepository;

@Service
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepo, CartItemRepository cartItemRepository) {
        this.cartRepo = cartRepo;
        this.cartItemRepository = cartItemRepository;
    }

    // System
    public Cart getCartById(Long cart_id) {
        Optional<Cart> optionalCart = this.cartRepo.findById(cart_id);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            return cart;
        } else {
            return null;
        }
    }

    // Admin
    public List<CartDTO> findAllCart() {
        List<Cart> cartList = this.cartRepo.findAll();
        List<CartDTO> cartDTOs = new ArrayList<>();

        for (Cart cart : cartList) {
            List<CartItem> cartItems = this.cartItemRepository.findByCart(cart);
            List<CartItemDTO> cartItemDTOs = new ArrayList<>();
            float total = 0;

            for (CartItem cartItem : cartItems) {
                CartItemDTO dto = new CartItemDTO();
                dto.setProductName(cartItem.getProduct().getName());

                dto.setProductPrice(cartItem.getProduct().getPrice());
                float productPrice = cartItem.getProduct().getPrice();

                dto.setProductQuantity(cartItem.getProductQuantity());
                long productQuantity = cartItem.getProductQuantity();

                float subtotal = productPrice * productQuantity;
                total += subtotal;

                dto.setUnit(cartItem.getProduct().getUnit());
                dto.setImage(cartItem.getProduct().getImage());
                dto.setSubTotal(subtotal);

                dto.setPhoneNum(cartItem.getCart().getPhonenum());
                dto.setDescription(cartItem.getCart().getDescription());

                cartItemDTOs.add(dto);
            }

            CartDTO cartDTO = new CartDTO(cartItemDTOs, total);
            cartDTOs.add(cartDTO);
        }

        return cartDTOs;
    }

    // Customer
    public List<Cart> showAllCarts(String phone) {
        return this.cartRepo.findAllByPhonenum(phone);
    }

    public Cart createCart(String phone) {
        Cart newCart = new Cart();
        newCart.setSum(0);
        newCart.setPhonenum(phone);
        newCart.setTotal(0);
        return this.cartRepo.save(newCart);
    }

    // save Cart
    public Cart saveCart(Cart cart) {
        return this.cartRepo.save(cart);
    }
}
