package vn.chubebanso.icecream.domain;

import java.io.Serializable;
import java.util.Objects;

public class CartItemImp implements Serializable {
    private Cart cart;
    private Product product;

    public CartItemImp() {
    }

    public CartItemImp(Cart cart, Product product) {
        this.cart = cart;
        this.product = product;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CartItemImp))
            return false;
        CartItemImp that = (CartItemImp) o;
        return Objects.equals(cart, that.cart) && Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cart, product);
    }
}
