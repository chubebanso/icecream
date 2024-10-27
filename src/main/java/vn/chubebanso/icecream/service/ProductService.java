package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.repository.CartItemRepository;
import vn.chubebanso.icecream.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;

    public ProductService(ProductRepository productRepository, CartItemRepository cartItemRepository,
            CartService cartService) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartService = cartService;
    }

    public Product handleCreateProduct(Product pr) {
        return this.productRepository.save(pr);
    }

    public List<Product> getAllProduct() {
        return this.productRepository.findAll();
    }

    public Product getProductById(Long product_id) {
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {
            Product pr = optionalProduct.get();
            return pr;
        } else {
            return null;
        }
    }

    public Product updateProduct(Long product_id, Product pr) {
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {
            optionalProduct.get().setCategory(pr.getCategory());
            optionalProduct.get().setName(pr.getName());
            optionalProduct.get().setPrice(pr.getPrice());
            optionalProduct.get().setUnit(pr.getUnit());
            optionalProduct.get().setImage(pr.getImage());
            return this.productRepository.save(optionalProduct.get());
        } else {
            return null;
        }
    }

    public void deleteProductById(Long product_id) {
        this.productRepository.deleteById(product_id);
    }

    public void handleAddProductToCart(Cart cart, Long product_id) {
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {
            CartItem oldCartiItem = this.cartItemRepository.findByCartAndProduct(cart, optionalProduct.get());
            if (oldCartiItem == null) {
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProduct(optionalProduct.get());
                cartItem.setPrice(optionalProduct.get().getPrice());
                cartItem.setProduct_quanity(1);
                this.cartItemRepository.save(cartItem);
                long sum = cart.getSum() + 1;
                cart.setSum(sum);
                cart = this.cartService.saveCart(cart);
            } else {
                oldCartiItem.setProduct_quanity(oldCartiItem.getProduct_quanity() + 1);
                this.cartItemRepository.save(oldCartiItem);
            }
        }
    }
}
