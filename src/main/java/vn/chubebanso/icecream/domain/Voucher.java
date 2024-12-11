package vn.chubebanso.icecream.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "voucher")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotEmpty(message = "Voucher type cannot be empty")
    @Pattern(regexp = "Khuyến mãi hàng tháng|Sinh nhật nhà hàng|Trung thu|Tết Âm Lịch|Quốc Khánh|30/4 - 1/5|Khác", message = "Voucher Type must be one of {Khuyến mãi hàng tháng, Sinh nhật nhà hàng, Trung thu, Tết Âm Lịch, Quốc Khánh, 30/4 - 1/5, Khác}")
    private String voucherType;

    private String voucherName;

    @DecimalMin(value = "1", message = "Phần trăm giảm giá phải lớn hơn 0")
    @DecimalMax(value = "100", message = "Phần trăm giảm giá phải nhỏ hơn 100")
    private float discountAmount;

    @DecimalMin(value = "0", message = "Activation value cannot be negative")
    private float minActivationValue;

    @JsonIgnore
    @OneToMany(mappedBy = "voucher")
    private List<Cart> carts;

    private String createdDate;

    private String expiredDate;

    private boolean isHidden;

    public boolean isHidden() {
        return isHidden;
    }

    public void setHidden(boolean isHidden) {
        this.isHidden = isHidden;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getExpiredDate() {
        return expiredDate;
    }

    public void setExpiredDate(String expiredDate) {
        this.expiredDate = expiredDate;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getVoucherType() {
        return voucherType;
    }

    public void setVoucherType(String voucherType) {
        this.voucherType = voucherType;
    }

    public String getVoucherName() {
        return voucherName;
    }

    public void setVoucherName(String voucherName) {
        this.voucherName = voucherName;
    }

    public float getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(float discountAmount) {
        this.discountAmount = discountAmount;
    }

    public float getMinActivationValue() {
        return minActivationValue;
    }

    public void setMinActivationValue(float minActivationValue) {
        this.minActivationValue = minActivationValue;
    }

    public List<Cart> getCarts() {
        return carts;
    }

    public void setCarts(List<Cart> carts) {
        this.carts = carts;
    }
}
