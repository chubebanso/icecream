package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.Voucher;
import vn.chubebanso.icecream.repository.CartItemRepository;
import vn.chubebanso.icecream.repository.CartRepository;
import vn.chubebanso.icecream.repository.VoucherRepository;

@Service
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepository;
    private final VoucherRepository voucherRepository;

    public CartService(CartRepository cartRepo, CartItemRepository cartItemRepository,
            VoucherRepository voucherRepository) {
        this.cartRepo = cartRepo;
        this.cartItemRepository = cartItemRepository;
        this.voucherRepository = voucherRepository;
    }

    // System returning a cart by ID => no need for body, just id and cart
    public Cart getCartById(Long cart_id) {
        Optional<Cart> optionalCart = this.cartRepo.findById(cart_id);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            return cart;
        } else {
            return null;
        }
    }

    // Admin shows all carts
    public List<Cart> findAllCart() {
        List<Cart> cartList = this.cartRepo.findAll();

        for (Cart cart : cartList) {
            List<CartItem> cartItems = this.cartItemRepository.findByCart(cart);
            float total = 0;

            for (CartItem cartItem : cartItems) {
                float productPrice = cartItem.getProduct().getPrice();
                long productQuantity = cartItem.getProductQuantity();

                float subtotal = productPrice * productQuantity;
                cartItem.setSubTotal(subtotal);

                total += subtotal;
            }

            if (cart.getVoucher() == null) {
                cart.setTotal(total);
            } else {
                float newTotal = total * (1 - (cart.getVoucher().getDiscountAmount()) / 100);
                cart.setTotal(total);
                cart.setNewTotal(newTotal);
            }
        }
        return cartList;
    }

    // // Customers show all previous orders
    // public List<Cart> showAllCarts(String phone) {
    // List<Cart> cartList = this.cartRepo.findAllByPhonenum(phone);

    // for (Cart cart : cartList) {
    // List<CartItem> cartItems = this.cartItemRepository.findByCart(cart);
    // float total = 0;

    // for (CartItem cartItem : cartItems) {
    // float productPrice = cartItem.getProduct().getPrice();
    // long productQuantity = cartItem.getProductQuantity();

    // float subtotal = productPrice * productQuantity;
    // cartItem.setSubTotal(subtotal);

    // total += subtotal;
    // }
    // Voucher voucher = cart.getVoucher();
    // if (voucher == null) {
    // cart.setTotal(total);
    // } else {
    // float newTotal = total * (1 - (voucher.getDiscountAmount()) / 100);
    // cart.setTotal(newTotal);
    // }
    // }
    // return cartList;
    // }

    // Customers show all previous orders
    // public Cart showCartsById(Long id) {
    // Optional<Cart> cart = this.cartRepo.findById(id);
    // Cart newCart = cart.get();
    // List<CartItem> cartItems = this.cartItemRepository.findByCart(newCart);
    // float total = 0;

    // for (CartItem cartItem : cartItems) {
    // float productPrice = cartItem.getProduct().getPrice();
    // long productQuantity = cartItem.getProductQuantity();

    // float subtotal = productPrice * productQuantity;
    // cartItem.setSubTotal(subtotal);

    // total += subtotal;

    // }
    // newCart.setTotal(total);
    // return newCart;

    // }

    // Customers delete cart
    public void deleteProductById(Long cart_id) {
        this.cartRepo.deleteById(cart_id);
    }

    // Customers create cart
    public Cart createCart(String phone) {
        Cart newCart = new Cart();
        newCart.setSum(0);
        newCart.setPhonenum(phone);
        newCart.setTotal(0);
        return this.cartRepo.save(newCart);
    }

    // System saves cart
    public Cart saveCart(Cart cart) {
        return this.cartRepo.save(cart);
    }

    // Applies voucher to cart
    public void handleApplyVoucherToCart(Cart cart, Voucher voucher) {
        Voucher oldVoucher = cart.getVoucher();
        if (oldVoucher == null) {
            cart.setVoucher(voucher);
            this.cartRepo.save(cart);
        } else {
            float total = cart.getTotal();
            cart.setNewTotal(total);
            cart.setVoucher(voucher);
            this.cartRepo.save(cart);
        }
    }

    public Cart showCartsById(Long id) {
        Optional<Cart> cart = this.cartRepo.findById(id);
        Cart newCart = cart.get();
        List<CartItem> cartItems = this.cartItemRepository.findByCart(newCart);
        float total = 0;
        for (CartItem cartItem : cartItems) {
            float productPrice = cartItem.getProduct().getPrice();
            long productQuantity = cartItem.getProductQuantity();
            float subtotal = productPrice * productQuantity;
            cartItem.setSubTotal(subtotal);
            total += subtotal;
        }
        newCart.setTotal(total);
        return newCart;
    }
}
