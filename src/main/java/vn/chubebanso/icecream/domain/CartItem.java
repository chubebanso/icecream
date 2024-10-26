package vn.chubebanso.icecream.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

@Entity
<<<<<<< HEAD
@IdClass(CartItemImp.class)
public class CartItem {

    // This class [class vn.chubebanso.icecream.domain.CartItem] does not define an
    // IdClass

    @Id
=======
@Table(name = "cart_item")
public class CartItem {
    @Id
    private long id;
>>>>>>> 1b6cb097be25beaa7bfc6ea0766ebb3851424802
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @NotNull
    private long product_quanity;

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public long getProduct_quanity() {
        return product_quanity;
    }

    public void setProduct_quanity(long product_quanity) {
        this.product_quanity = product_quanity;
    }
}
