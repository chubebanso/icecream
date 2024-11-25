package vn.chubebanso.icecream.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.Voucher;
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
                cart.setNewTotal(total);
            } else {
                float activationValue = cart.getVoucher().getMinActivationValue();
                if (total >= activationValue) {
                    float newTotal = total * (1 - (cart.getVoucher().getDiscountAmount()) / 100);
                    cart.setTotal(total);
                    cart.setNewTotal(newTotal);
                } else {
                    cart.setTotal(total);
                }
            }
        }
        return cartList;
    }

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
        Instant instant = Instant.now();
        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");

        // Ngày tạo Voucher với múi giờ Việt Nam
        ZonedDateTime createdDate = instant.atZone(zone);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

        newCart.setCreatedAt(createdDate.format(formatter));

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

        if (newCart.getVoucher() == null) {
            newCart.setTotal(total);
            newCart.setNewTotal(total);
        } else {
            float activationValue = newCart.getVoucher().getMinActivationValue();
            if (total >= activationValue) {
                float newTotal = total * (1 - (newCart.getVoucher().getDiscountAmount()) / 100);
                newCart.setTotal(total);
                newCart.setNewTotal(newTotal);
            } else {
                newCart.setTotal(total);
            }
        }
        return newCart;
    }

    public void submitCart(Cart cart) {
        cart.setSubmit(true);
        cart.setStatus("Đang chờ");
        this.cartRepo.save(cart);
    }
}
