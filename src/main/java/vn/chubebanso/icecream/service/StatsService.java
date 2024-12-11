package vn.chubebanso.icecream.service;

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
import vn.chubebanso.icecream.repository.ProductRepository;
import vn.chubebanso.icecream.repository.ProductStatsRepository;
import vn.chubebanso.icecream.repository.VoucherRepository;
import vn.chubebanso.icecream.repository.VoucherStatsRepository;
import vn.chubebanso.icecream.repository.VoucherValueStatsRepository;

@Service
public class StatsService {
    private final CartRepository cartRepo;
    private final CustomerStatsRepository customerStatsRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductStatsRepository productStatsRepository;
    private final ProductRepository productRepository;
    private final CategoryStatsRepository categoryStatsRepository;
    private final VoucherStatsRepository voucherStatsRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherValueStatsRepository voucherValueStatsRepository;

    public StatsService(CartRepository cartRepo, CustomerStatsRepository customerStatsRepository,
            CartItemRepository cartItemRepository, ProductStatsRepository productStatsRepository,
            ProductRepository productRepository, CategoryStatsRepository categoryStatsRepository,
            VoucherStatsRepository voucherStatsRepository, VoucherRepository voucherRepository,
            VoucherValueStatsRepository voucherValueStatsRepository) {
        this.cartRepo = cartRepo;
        this.customerStatsRepository = customerStatsRepository;
        this.cartItemRepository = cartItemRepository;
        this.productStatsRepository = productStatsRepository;
        this.productRepository = productRepository;
        this.categoryStatsRepository = categoryStatsRepository;
        this.voucherStatsRepository = voucherStatsRepository;
        this.voucherRepository = voucherRepository;
        this.voucherValueStatsRepository = voucherValueStatsRepository;
    }

    // Customer-stats
    public CustomerStats findCustomerStatsById(Long statsId) {
        Optional<CustomerStats> optionalCustomerStats = this.customerStatsRepository.findById(statsId);
        if (optionalCustomerStats.isPresent()) {
            CustomerStats customerStats = optionalCustomerStats.get();
            return customerStats;
        } else {
            return null;
        }
    }

    public CustomerStats createCustomerStats(String phonenum) {
        CustomerStats customerStats = new CustomerStats();
        customerStats.setPhonenum(phonenum);
        customerStats.setTotalOrders(0);
        customerStats.setTotalSpent(0);
        customerStats.setAmountOrdered(0);
        return this.customerStatsRepository.save(customerStats);
    }

    public CustomerStats getCustomerStats(String phonenum) {
        CustomerStats customerStats = this.customerStatsRepository.findStatsByPhonenum(phonenum);
        List<Cart> carts = this.cartRepo.findAllByPhonenum(phonenum);
        float totalSpent = 0;
        long ordersSum = 0;
        long productQuantity = 0;

        if (carts.isEmpty()) {
            return customerStats;
        } else {
            for (Cart cart : carts) {
                if (cart.getStatus() != null && cart.getSaveStatus() != null
                        && cart.getStatus().equals("delivered")
                        && cart.getSaveStatus().equals("yes")) {
                    List<CartItem> cartItems = this.cartItemRepository.findByCart(cart);
                    for (CartItem cartItem : cartItems) {
                        productQuantity += cartItem.getProductQuantity();
                    }
                    ordersSum++;
                    totalSpent += cart.getNewTotal();
                }
            }

            customerStats.setAmountOrdered(productQuantity);
            customerStats.setTotalOrders(ordersSum);
            customerStats.setTotalSpent(totalSpent);
            this.customerStatsRepository.save(customerStats);
            return customerStats;
        }
    }

    public List<CustomerStats> getAllCustomerStats() {
        List<CustomerStats> customerStatsList = this.customerStatsRepository.findAll();

        for (CustomerStats customerStats : customerStatsList) {
            float totalSpent = 0;
            long ordersSum = 0;
            long productQuantity = 0;
            String phonenum = customerStats.getPhonenum();
            List<Cart> carts = this.cartRepo.findAllByPhonenum(phonenum);

            if (carts.isEmpty()) {
                this.customerStatsRepository.save(customerStats);
            } else {
                for (Cart cart : carts) {
                    if (cart.getStatus() != null && cart.getSaveStatus() != null
                            && cart.getStatus().equals("delivered")
                            && cart.getSaveStatus().equals("yes")) {
                        List<CartItem> cartItems = this.cartItemRepository.findByCart(cart);
                        for (CartItem cartItem : cartItems) {
                            productQuantity += cartItem.getProductQuantity();
                        }
                        ordersSum++;
                        totalSpent += cart.getNewTotal();
                    }
                }
                customerStats.setAmountOrdered(productQuantity);
                customerStats.setTotalOrders(ordersSum);
                customerStats.setTotalSpent(totalSpent);
                this.customerStatsRepository.save(customerStats);
            }
        }

        return customerStatsList;
    }

    // product-stats
    public ProductStats createProductStats(String name) {
        ProductStats productStats = new ProductStats();

        productStats.setName(name);
        productStats.setProductOrderedQuantity(0);
        productStats.setProductRevenue(0);

        return this.productStatsRepository.save(productStats);
    }

    public ProductStats findProductStatsById(Long product_id) {
        Optional<ProductStats> optionalProductStats = this.productStatsRepository.findById(product_id);
        if (optionalProductStats.isPresent()) {
            ProductStats productStats = optionalProductStats.get();
            return productStats;
        } else {
            return null;
        }
    }

    public ProductStats getProductStats(String name) {
        ProductStats productStats = this.productStatsRepository.findByName(name);

        Product product = this.productRepository.findByName(name);
        if (product != null) {
            long productCount = 0;
            float productRevenue = 0;

            List<CartItem> cartItems = this.cartItemRepository.findCartItemsByProduct(product);
            for (CartItem cartItem : cartItems) {
                Cart cart = this.cartRepo.findCartByCartItem(cartItem);
                if (cart.getStatus() != null && cart.getSaveStatus() != null
                        && cart.getStatus().equals("delivered")
                        && cart.getSaveStatus().equals("yes")) {
                    productCount += cartItem.getProductQuantity();
                    productRevenue += cartItem.getSubTotal();
                }
            }
            productStats.setProductOrderedQuantity(productCount);
            productStats.setProductRevenue(productRevenue);
            this.productStatsRepository.save(productStats);
            return productStats;
        } else {
            return productStats;
        }
    }

    public List<ProductStats> getAllProductStats() {
        List<ProductStats> productStatsList = this.productStatsRepository.findAll();

        for (ProductStats productStats : productStatsList) {
            String name = productStats.getName();
            Product product = this.productRepository.findByName(name);

            if (product != null) {
                long productCount = 0;
                float productRevenue = 0;

                List<CartItem> cartItems = this.cartItemRepository.findCartItemsByProduct(product);
                for (CartItem cartItem : cartItems) {
                    Cart cart = this.cartRepo.findCartByCartItem(cartItem);
                    if (cart.getStatus() != null && cart.getSaveStatus() != null
                            && cart.getStatus().equals("delivered")
                            && cart.getSaveStatus().equals("yes")) {
                        productCount += cartItem.getProductQuantity();
                        productRevenue += cartItem.getSubTotal();
                    }
                }
                productStats.setProductOrderedQuantity(productCount);
                productStats.setProductRevenue(productRevenue);
                this.productStatsRepository.save(productStats);
            } else {
                this.productStatsRepository.save(productStats);
            }
        }
        return productStatsList;
    }

    // category-stats
    public CategoryStats createCategoryStats(String category) {
        CategoryStats categoryStats = new CategoryStats();
        categoryStats.setProductCategory(category);
        categoryStats.setProductCategoryOrderedQuantity(0);
        categoryStats.setProductCategoryRevenue(0);
        return this.categoryStatsRepository.save(categoryStats);
    }

    public CategoryStats getCategoryStatsById(Long stats_id) {
        Optional<CategoryStats> optionalCategoryStats = this.categoryStatsRepository.findById(stats_id);
        if (optionalCategoryStats.isPresent()) {
            CategoryStats categoryStats = optionalCategoryStats.get();
            return categoryStats;
        } else {
            return null;
        }
    }

    public CategoryStats getCategoryStats(String category) {
        CategoryStats categoryStats = this.categoryStatsRepository.findByProductCategory(category);
        List<Product> products = this.productRepository.findAllByCategory(category);

        if (products.isEmpty()) {
            return this.categoryStatsRepository.save(categoryStats);
        } else {
            long categoryCount = 0;
            float categoryRevenue = 0;
            for (Product product : products) {

                List<CartItem> cartItems = this.cartItemRepository.findCartItemsByProduct(product);
                for (CartItem cartItem : cartItems) {
                    Cart cart = this.cartRepo.findCartByCartItem(cartItem);
                    if (cart.getStatus() != null && cart.getSaveStatus() != null
                            && cart.getStatus().equals("delivered")
                            && cart.getSaveStatus().equals("yes")) {
                        categoryCount += cartItem.getProductQuantity();
                        categoryRevenue += cartItem.getSubTotal();
                    }

                }
            }
            categoryStats.setProductCategoryOrderedQuantity(categoryCount);
            categoryStats.setProductCategoryRevenue(categoryRevenue);
            this.categoryStatsRepository.save(categoryStats);
            return categoryStats;
        }

    }

    public List<CategoryStats> getAllCategoryStats() {
        List<CategoryStats> categoryStatsList = this.categoryStatsRepository.findAll();

        for (CategoryStats categoryStats : categoryStatsList) {
            String category = categoryStats.getProductCategory();
            List<Product> products = this.productRepository.findAllByCategory(category);

            if (products.isEmpty()) {
                this.categoryStatsRepository.save(categoryStats);
            } else {
                long categoryCount = 0;
                float categoryRevenue = 0;
                for (Product product : products) {

                    List<CartItem> cartItems = this.cartItemRepository.findCartItemsByProduct(product);

                    for (CartItem cartItem : cartItems) {
                        Cart cart = this.cartRepo.findCartByCartItem(cartItem);

                        if (cart.getStatus() != null && cart.getSaveStatus() != null
                                && cart.getStatus().equals("delivered")
                                && cart.getSaveStatus().equals("yes")) {
                            categoryCount += cartItem.getProductQuantity();
                            categoryRevenue += cartItem.getSubTotal();
                        }
                    }

                }
                categoryStats.setProductCategoryOrderedQuantity(categoryCount);
                categoryStats.setProductCategoryRevenue(categoryRevenue);
                this.categoryStatsRepository.save(categoryStats);

            }
        }
        return categoryStatsList;
    }

    // voucher-stats
    public VoucherStats createVoucherStats(String name, Float minActivationValue, Long discountAmount) {
        VoucherStats voucherStats = new VoucherStats();
        voucherStats.setVoucherName(name);
        voucherStats.setMinActivationValue(minActivationValue);
        voucherStats.setTimesUsed(0);
        voucherStats.setVoucherRevenue(0);
        voucherStats.setDiscountAmount(discountAmount);
        return this.voucherStatsRepository.save(voucherStats);
    }

    public VoucherStats findVoucherStatsById(Long stats_id) {
        Optional<VoucherStats> optionalVoucherStats = this.voucherStatsRepository.findById(stats_id);
        if (optionalVoucherStats.isPresent()) {
            VoucherStats voucherStats = optionalVoucherStats.get();
            return voucherStats;
        } else {
            return null;
        }
    }

    public VoucherStats getVoucherStats(String voucherName) {
        VoucherStats voucherStats = this.voucherStatsRepository.findByVoucherName(voucherName);
        Voucher voucher = this.voucherRepository.findByVoucherName(voucherName);

        if (voucher != null) {
            List<Cart> carts = this.cartRepo.findAllByVoucher(voucher);
            long timesUsed = 0;
            long voucherRevenue = 0;
            for (Cart cart : carts) {
                if (cart.getStatus() != null && cart.getSaveStatus() != null
                        && cart.getStatus().equals("delivered")
                        && cart.getSaveStatus().equals("yes")) {
                    timesUsed++;
                    voucherRevenue += cart.getNewTotal();
                }
            }
            voucherStats.setTimesUsed(timesUsed);
            voucherStats.setVoucherRevenue(voucherRevenue);
            this.voucherStatsRepository.save(voucherStats);
            return voucherStats;

        } else {
            return voucherStats;
        }
    }

    public List<VoucherStats> getAllVoucherStats() {
        List<VoucherStats> voucherStatsList = this.voucherStatsRepository.findAll();
        for (VoucherStats voucherStats : voucherStatsList) {
            String name = voucherStats.getVoucherName();
            Voucher voucher = this.voucherRepository.findByVoucherName(name);

            if (voucher != null) {
                List<Cart> carts = this.cartRepo.findAllByVoucher(voucher);
                long timesUsed = 0;
                long voucherRevenue = 0;
                for (Cart cart : carts) {
                    if (cart.getStatus() != null && cart.getSaveStatus() != null
                            && cart.getStatus().equals("delivered")
                            && cart.getSaveStatus().equals("yes")) {
                        timesUsed++;
                        voucherRevenue += cart.getNewTotal();
                    }
                }
                voucherStats.setTimesUsed(timesUsed);
                voucherStats.setVoucherRevenue(voucherRevenue);
                this.voucherStatsRepository.save(voucherStats);

            } else {
                this.voucherStatsRepository.save(voucherStats);
            }
        }

        return voucherStatsList;
    }

    // voucher-min-av
    public VoucherValueStats createVoucherValueStats(long minActivationValue) {
        VoucherValueStats voucherValueStats = new VoucherValueStats();
        voucherValueStats.setMinActivationValue(minActivationValue);
        voucherValueStats.setRevenue(0);
        voucherValueStats.setTimesUsed(0);
        this.voucherValueStatsRepository.save(voucherValueStats);
        return voucherValueStats;
    }

    public List<VoucherValueStats> getAllVoucherValueStats() {
        List<VoucherValueStats> statsList = this.voucherValueStatsRepository.findAll();
        for (VoucherValueStats voucherValueStats : statsList) {
            float activationValue = (float) voucherValueStats.getMinActivationValue();
            List<Voucher> vouchers = this.voucherRepository.findByMinActivationValue(activationValue);

            if (vouchers.isEmpty()) {
                this.voucherValueStatsRepository.save(voucherValueStats);
            } else {
                long timesUsed = 0;
                float revenue = 0;
                for (Voucher voucher : vouchers) {
                    List<Cart> carts = this.cartRepo.findAllByVoucher(voucher);
                    for (Cart cart : carts) {
                        if (cart.getStatus() != null && cart.getSaveStatus() != null
                                && cart.getStatus().equals("delivered")
                                && cart.getSaveStatus().equals("yes")) {
                            timesUsed++;
                            revenue += cart.getNewTotal();
                        }
                    }
                }
                voucherValueStats.setRevenue(revenue);
                voucherValueStats.setTimesUsed(timesUsed);
                this.voucherValueStatsRepository.save(voucherValueStats);
            }
        }
        return statsList;
    }
}
