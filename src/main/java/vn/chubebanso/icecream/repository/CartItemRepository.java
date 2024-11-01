package vn.chubebanso.icecream.repository;

import java.util.List;
import vn.chubebanso.icecream.domain.CartItemID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.Product;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, CartItemID> {
    CartItem findByCartAndProduct(Cart cart, Product product);

    CartItem findByCartIdAndProductId(Long cart_id, Long product_id);

    List<CartItem> findByCart(Cart cart);
}
