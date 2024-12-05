package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.CustomerStats;
import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.domain.ProductStats;
import vn.chubebanso.icecream.repository.CartItemRepository;
import vn.chubebanso.icecream.repository.CartRepository;
import vn.chubebanso.icecream.repository.CustomerStatsRepository;
import vn.chubebanso.icecream.repository.ProductRepository;
import vn.chubebanso.icecream.repository.ProductStatsRepository;

@Service
public class StatsService {
    private final CartRepository cartRepo;
    private final CustomerStatsRepository customerStatsRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductStatsRepository productStatsRepository;
    private final ProductRepository productRepository;

    public StatsService(CartRepository cartRepo, CustomerStatsRepository customerStatsRepository,
            CartItemRepository cartItemRepository, ProductStatsRepository productStatsRepository,
            ProductRepository productRepository) {
        this.cartRepo = cartRepo;
        this.customerStatsRepository = customerStatsRepository;
        this.cartItemRepository = cartItemRepository;
        this.productStatsRepository = productStatsRepository;
        this.productRepository = productRepository;
    }

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
        List<Cart> carts = this.cartRepo.findAllByPhonenum(phonenum);
        float totalSpent = 0;
        long ordersSum = 0;
        long productQuantity = 0;

        for (Cart cart : carts) {
            if (cart.getStatus() != null && cart.getStatus().equals("delivered")) {
                List<CartItem> cartItems = this.cartItemRepository.findByCart(cart);
                for (CartItem cartItem : cartItems) {
                    productQuantity += cartItem.getProductQuantity();
                }
                ordersSum++;
                totalSpent += cart.getNewTotal();
            }
        }
        CustomerStats customerStats = this.customerStatsRepository.findStatsByPhonenum(phonenum);
        customerStats.setAmountOrdered(productQuantity);
        customerStats.setTotalOrders(ordersSum);
        customerStats.setTotalSpent(totalSpent);
        this.customerStatsRepository.save(customerStats);
        return customerStats;
    }

    public List<CustomerStats> getAllCustomerStats() {
        List<CustomerStats> customerStatsList = this.customerStatsRepository.findAll();

        for (CustomerStats customerStats : customerStatsList) {
            float totalSpent = 0;
            long ordersSum = 0;
            long productQuantity = 0;
            String phonenum = customerStats.getPhonenum();
            List<Cart> carts = this.cartRepo.findAllByPhonenum(phonenum);

            for (Cart cart : carts) {
                if (cart.getStatus() != null && cart.getStatus().equals("delivered")) {
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
        return customerStatsList;
    }

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
                if (cart.getStatus() != null && cart.getStatus().equals("delivered")) {
                    productCount += cartItem.getProductQuantity();
                    productRevenue += cartItem.getSubTotal();
                }
            }
            productStats.setProductOrderedQuantity(productCount);
            productStats.setProductRevenue(productRevenue);
            this.productStatsRepository.save(productStats);
            return productStats;
        } else {
            return null;
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
                    if (cart.getStatus() != null && cart.getStatus().equals("delivered")) {
                        productCount += cartItem.getProductQuantity();
                        productRevenue += cartItem.getSubTotal();
                    }
                }
                productStats.setProductOrderedQuantity(productCount);
                productStats.setProductRevenue(productRevenue);
                this.productStatsRepository.save(productStats);
            }
        }
        return productStatsList;
    }
}
