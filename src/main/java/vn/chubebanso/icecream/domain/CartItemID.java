package vn.chubebanso.icecream.domain;

import java.io.Serializable;
import java.util.Objects;

public class CartItemID implements Serializable {

    private Long cart;
    private Long product;

    public CartItemID() {

    }

    public CartItemID(Long cart, Long product) {
        this.cart = cart;
        this.product = product;
    }

    public Long getCart() {
        return cart;
    }

    public void setCart(Long cart) {
        this.cart = cart;
    }

    public Long getProduct() {
        return product;
    }

    public void setProduct(Long product) {
        this.product = product;
    }

    @Override
    public int hashCode() {
        return Objects.hash(cart, product);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final CartItemID other = (CartItemID) obj;
        if (!Objects.equals(this.cart, other.cart)) {
            return false;
        }
        return Objects.equals(this.product, other.product);
    }
}
