package vn.chubebanso.icecream.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "cartitem")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Id
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @Id
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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

}
