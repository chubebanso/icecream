package vn.chubebanso.icecream.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.CategoryStats;
import vn.chubebanso.icecream.domain.CustomerStats;
import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.domain.ProductStats;
import vn.chubebanso.icecream.domain.Voucher;
import vn.chubebanso.icecream.domain.VoucherStats;
import vn.chubebanso.icecream.domain.VoucherValueStats;
import vn.chubebanso.icecream.repository.CartItemRepository;
import vn.chubebanso.icecream.repository.CartRepository;
import vn.chubebanso.icecream.repository.CategoryStatsRepository;
import vn.chubebanso.icecream.repository.CustomerStatsRepository;
import vn.chubebanso.icecream.repository.ProductStatsRepository;
import vn.chubebanso.icecream.repository.VoucherStatsRepository;
import vn.chubebanso.icecream.repository.VoucherValueStatsRepository;

@Service
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepository;
    private final StatsService statsService;
    private final CustomerStatsRepository customerStatsRepository;
    private final ProductStatsRepository productStatsRepository;
    private final CategoryStatsRepository categoryStatsRepository;
    private final VoucherStatsRepository voucherStatsRepository;
    private final VoucherValueStatsRepository voucherValueStatsRepository;

    public CartService(CartRepository cartRepo, CartItemRepository cartItemRepository, StatsService statsService,
            CustomerStatsRepository customerStatsRepository, ProductStatsRepository productStatsRepository,
            CategoryStatsRepository categoryStatsRepository, VoucherStatsRepository voucherStatsRepository,
            VoucherValueStatsRepository voucherValueStatsRepository) {
        this.cartRepo = cartRepo;
        this.cartItemRepository = cartItemRepository;
        this.statsService = statsService;
        this.customerStatsRepository = customerStatsRepository;
        this.productStatsRepository = productStatsRepository;
        this.categoryStatsRepository = categoryStatsRepository;
        this.voucherStatsRepository = voucherStatsRepository;
        this.voucherValueStatsRepository = voucherValueStatsRepository;
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

        // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy
        // HH:mm");

        Date createdAt = Date.from(createdDate.toInstant());
        newCart.setCreatedAt(createdAt);

        CustomerStats customerStats = this.customerStatsRepository.findStatsByPhonenum(phone);
        if (customerStats == null) {
            this.statsService.createCustomerStats(phone);
        }

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

    public void update(Cart cart, String status) {
        cart.setStatus(status);
        this.cartRepo.save(cart);
    }

    public List<Cart> findCartsByPhonenum(String phonenum) {
        return this.cartRepo.findAllByPhonenum(phonenum);
    }

    public List<Cart> findCartsBetweenDate(Date startDate, Date endDate) {
        List<Cart> carts = this.cartRepo.findAll();

        for (Cart cart : carts) {
            Date createdAt = cart.getCreatedAt();
            List<Cart> cartList = this.cartRepo.findAllByCreatedAt(createdAt);
            for (Cart filteredCart : cartList) {
                Date filteredCartCreatedAt = filteredCart.getCreatedAt();
                if (filteredCartCreatedAt.compareTo(startDate) >= 0 && filteredCartCreatedAt.compareTo(endDate) <= 0
                        && filteredCart.getStatus() != null && filteredCart.getStatus().equals("delivered")) {
                    String phonenum = filteredCart.getPhonenum();
                    CustomerStats customerStats = this.customerStatsRepository.findStatsByPhonenum(phonenum);
                    if (customerStats == null) {
                        this.statsService.createCustomerStats(phonenum);
                    }
                    List<CartItem> cartItems = this.cartItemRepository.findByCart(filteredCart);
                    float total = 0;
                    for (CartItem cartItem : cartItems) {
                        float productPrice = cartItem.getProduct().getPrice();
                        long productQuantity = cartItem.getProductQuantity();

                        float subtotal = productPrice * productQuantity;
                        cartItem.setSubTotal(subtotal);

                        total += subtotal;

                        Product product = cartItem.getProduct();
                        String name = product.getName();
                        String category = product.getCategory();

                        ProductStats productStats = this.productStatsRepository.findByName(name);
                        if (productStats == null) {
                            this.statsService.createProductStats(name);
                        }

                        CategoryStats categoryStats = this.categoryStatsRepository.findByProductCategory(category);
                        if (categoryStats == null) {
                            this.statsService.createCategoryStats(category);
                        }
                    }

                    Voucher voucher = filteredCart.getVoucher();

                    if (voucher == null) {
                        filteredCart.setTotal(total);
                        filteredCart.setNewTotal(total);
                    } else {
                        float activationValue = voucher.getMinActivationValue();
                        if (total >= activationValue) {
                            float newTotal = total * (1 - (filteredCart.getVoucher().getDiscountAmount()) / 100);
                            filteredCart.setTotal(total);
                            filteredCart.setNewTotal(newTotal);
                        } else {
                            filteredCart.setTotal(total);
                        }

                        String name = voucher.getVoucherName();
                        long discountAmount = (long) voucher.getDiscountAmount();
                        VoucherStats voucherStats = this.voucherStatsRepository.findByVoucherName(name);
                        if (voucherStats == null) {
                            this.statsService.createVoucherStats(name, activationValue, discountAmount);
                        }

                        long minActivationValue = (long) activationValue;
                        VoucherValueStats voucherValueStats = this.voucherValueStatsRepository
                                .findByMinActivationValue(minActivationValue);
                        if (voucherValueStats == null) {
                            this.statsService.createVoucherValueStats(minActivationValue);
                        }
                    }

                }
                cart.setTotal(filteredCart.getTotal());
                cart.setNewTotal(filteredCart.getNewTotal());
            }
            this.cartRepo.save(cart);
        }
        return carts;
    }
}
