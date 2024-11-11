package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.repository.CartItemRepository;
import vn.chubebanso.icecream.repository.CartRepository;
import vn.chubebanso.icecream.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;
    private final CartRepository cartRepo;

    public ProductService(ProductRepository productRepository, CartItemRepository cartItemRepository,
            CartService cartService, CartRepository cartRepo) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartService = cartService;
        this.cartRepo = cartRepo;
    }

    // Admin's order to create a product
    public Product handleCreateProduct(Product pr) {
        return this.productRepository.save(pr);
    }

    // Admin's order to show all products
    public List<Product> getAllProduct() {
        return this.productRepository.findAll();
    }

    // Admin's order to show product by ID
    public Product getProductById(Long product_id) {
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {
            Product pr = optionalProduct.get();
            return pr;
        } else {
            return null;
        }
    }

    // Admin updates Product
    public Product updateProduct(Long product_id, Product pr) {
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {
            optionalProduct.get().setCategory(pr.getCategory());
            optionalProduct.get().setName(pr.getName());
            optionalProduct.get().setPrice(pr.getPrice());
            optionalProduct.get().setUnit(pr.getUnit());
            optionalProduct.get().setImage(pr.getImage());
            optionalProduct.get().setAvailableForOrder(pr.isAvailableForOrder());
            return this.productRepository.save(optionalProduct.get());
        } else {
            return null;
        }
    }

    // Admin deletes product
    public void deleteProductById(Long product_id) {
        this.productRepository.deleteById(product_id);
    }

    // Customer's product-adding handler
    public void handleAddProductToCart(Cart cart, Long product_id, Long quantity) {
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {
            CartItem oldCartItem = this.cartItemRepository.findByCartAndProduct(cart, optionalProduct.get());
            if (oldCartItem == null) {
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProduct(optionalProduct.get());
                cartItem.setSubTotal(optionalProduct.get().getPrice());
                cartItem.setProductQuantity(quantity);
                this.cartItemRepository.save(cartItem);
                long sum = cart.getSum() + 1;
                cart.setSum(sum);
            } else {
                oldCartItem.setProductQuantity(oldCartItem.getProductQuantity() + quantity);
                this.cartItemRepository.save(oldCartItem);
            }
            this.cartService.saveCart(cart);
        }
    }

    // returning cart item via cart
    public List<CartItem> getCartItembyCart(Long cart_id) {
        Optional<Cart> optionalCart = this.cartRepo.findById(cart_id);
        if (optionalCart.isPresent()) {
            List<CartItem> cartItems = this.cartItemRepository.findByCart(optionalCart.get());

            for (CartItem cartItem : cartItems) {
                float productPrice = cartItem.getProduct().getPrice();
                long productQuantity = cartItem.getProductQuantity();

                float subtotal = productPrice * productQuantity;

                cartItem.setSubTotal(subtotal);
            }

            return cartItems;
        } else {
            return null;
        }
    }

    public void handleDeleteItemFromCart(Cart cart, Product product) {
        CartItem cartItem = this.cartItemRepository.findByCartAndProduct(cart, product);

        if (cartItem != null) {
            long newQuantity = cartItem.getProductQuantity() - 1;

            if (newQuantity <= 0) {
                // Xóa sản phẩm khỏi giỏ hàng nếu số lượng là 0
                this.cartItemRepository.delete(cartItem);
            } else {
                // Cập nhật số lượng sản phẩm còn lại nếu số lượng lớn hơn 0
                cartItem.setProductQuantity(newQuantity);
                this.cartItemRepository.save(cartItem);
            }
        }
    }
}
