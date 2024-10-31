package vn.chubebanso.icecream.dto;

// lấy cart item thì t muốn lấy cả thông tin sản phẩm nào... nên là làm 1 cái dto để đẩy dữ liệu ra
public class CartItemDTO {

    private String productName;
    private float productPrice;
    private String unit;
    private String image;
    private long productQuantity;
    private float subTotal;
    private String phoneNum;
    private String description;

    public CartItemDTO() {

    }

    public CartItemDTO(String productName, float productPrice, long productQuantity, float subTotal,
            String unit, String image, String phoneNum, String description) {
        this.productName = productName;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.subTotal = subTotal;
        this.unit = unit;
        this.image = image;
        this.phoneNum = phoneNum;
        this.description = description;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public float getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(float productPrice) {
        this.productPrice = productPrice;
    }

    public long getProductQuantity() {
        return productQuantity;
    }

    public void setProductQuantity(long productQuantity) {
        this.productQuantity = productQuantity;
    }

    public float getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(float subTotal) {
        this.subTotal = subTotal;
    }

}
