package vn.chubebanso.icecream.domain;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "voucher_value_stats")
public class VoucherValueStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long minActivationValue;
    private long timesUsed;
    private float revenue;

    public long getMinActivationValue() {
        return minActivationValue;
    }

    public void setMinActivationValue(long minActivationValue) {
        this.minActivationValue = minActivationValue;
    }

    public long getTimesUsed() {
        return timesUsed;
    }

    public void setTimesUsed(long timesUsed) {
        this.timesUsed = timesUsed;
    }

    public float getRevenue() {
        return revenue;
    }

    public void setRevenue(float revenue) {
        this.revenue = revenue;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
