package vn.chubebanso.icecream.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "voucher_stats")
public class VoucherStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // voucher
    private String voucherName;
    private float minActivationValue;
    private long timesUsed;
    private float voucherRevenue;
    private long discountAmount;

    public long getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(long discountAmount) {
        this.discountAmount = discountAmount;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getVoucherName() {
        return voucherName;
    }

    public void setVoucherName(String voucherName) {
        this.voucherName = voucherName;
    }

    public float getMinActivationValue() {
        return minActivationValue;
    }

    public void setMinActivationValue(float minActivationValue) {
        this.minActivationValue = minActivationValue;
    }

    public long getTimesUsed() {
        return timesUsed;
    }

    public void setTimesUsed(long timesUsed) {
        this.timesUsed = timesUsed;
    }

    public float getVoucherRevenue() {
        return voucherRevenue;
    }

    public void setVoucherRevenue(float voucherRevenue) {
        this.voucherRevenue = voucherRevenue;
    }
}
