package vn.chubebanso.icecream.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer_stats")
public class CustomerStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // customers
    private long totalOrders;
    private float totalSpent;
    private String phonenum;
    private long amountOrdered;

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public float getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(float totalSpent) {
        this.totalSpent = totalSpent;
    }

    public String getPhonenum() {
        return phonenum;
    }

    public void setPhonenum(String phonenum) {
        this.phonenum = phonenum;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getAmountOrdered() {
        return amountOrdered;
    }

    public void setAmountOrdered(long amountOrdered) {
        this.amountOrdered = amountOrdered;
    }
}
