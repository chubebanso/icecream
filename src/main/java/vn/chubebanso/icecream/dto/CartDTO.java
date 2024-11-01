package vn.chubebanso.icecream.dto;

import java.util.List;

public class CartDTO {

    private List<CartItemDTO> cartItemDTOs;
    private float total;

    public CartDTO(){
        
    }

    public CartDTO(List<CartItemDTO> cartItemDTOs, float total) {
        this.cartItemDTOs = cartItemDTOs;
        this.total = total;
    }

    public List<CartItemDTO> getCartItemDTOs() {
        return cartItemDTOs;
    }

    public void setCartItemDTOs(List<CartItemDTO> cartItemDTOs) {
        this.cartItemDTOs = cartItemDTOs;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

}
