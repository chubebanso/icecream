package vn.chubebanso.icecream.domain;

// tương tự với CartItemDTO
public class ProductDTO {
    private String name;
    private float price;
    private String unit;
    private boolean isAvailableForOrder;
    private String image;
    private String category;
    
    public ProductDTO(){
        
    }

    public ProductDTO(String name, float price, String unit, boolean isAvailableForOrder, String image,
            String category) {
        this.name = name;
        this.price = price;
        this.unit = unit;
        this.isAvailableForOrder = isAvailableForOrder;
        this.image = image;
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public boolean isAvailableForOrder() {
        return isAvailableForOrder;
    }

    public void setAvailableForOrder(boolean isAvailableForOrder) {
        this.isAvailableForOrder = isAvailableForOrder;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
