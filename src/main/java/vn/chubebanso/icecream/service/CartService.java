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

    public CartService(CartRepository cartRepo, CartItemRepository cartItemRepository, VoucherRepository voucherRepository) {
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
            cart.setTotal(total);
        }
        return cartList;
    }

    // Customers show all previous orders
    public List<Cart> showAllCarts(String phone) {
        List<Cart> cartList = this.cartRepo.findAllByPhonenum(phone);

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
            cart.setTotal(total);
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
        return this.cartRepo.save(newCart);
    }

    // System saves cart
    public Cart saveCart(Cart cart) {
        return this.cartRepo.save(cart);
    }

    // thêm Voucher vào giỏ hàng 
    public void handleApplyVoucherToCart(Cart cart, Long voucher_id) {
        Optional<Voucher> optionalVoucher = this.voucherRepository.findById(voucher_id);
        if (optionalVoucher.isPresent()) {
            Voucher oldVoucher = this.voucherRepository.findByCartAndVoucher(cart, optionalVoucher.get());
            if (oldVoucher == null) {
                Voucher voucher = new Voucher();
                voucher.setVoucherName(optionalVoucher.get().getVoucherName());
                voucher.setVoucherType(optionalVoucher.get().getVoucherType());
                voucher.setDiscountAmount(optionalVoucher.get().getDiscountAmount());
                voucher.setMinActivationValue(optionalVoucher.get().getMinActivationValue());

                cart.setVoucher(voucher); 
            } else {
                oldVoucher.setVoucherName(optionalVoucher.get().getVoucherName());
                oldVoucher.setVoucherType(optionalVoucher.get().getVoucherType());
                oldVoucher.setDiscountAmount(optionalVoucher.get().getDiscountAmount());
                oldVoucher.setMinActivationValue(optionalVoucher.get().getMinActivationValue());

                cart.setVoucher(oldVoucher); 
            }
        }
    }
}
