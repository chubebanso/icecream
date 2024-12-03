package vn.chubebanso.icecream.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_stats")
public class ProductStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // product
    private String name;
    private float productRevenue;
    private long productOrderedQuantity;

    public float getProductRevenue() {
        return productRevenue;
    }

    public void setProductRevenue(float productRevenue) {
        this.productRevenue = productRevenue;
    }

    public long getProductOrderedQuantity() {
        return productOrderedQuantity;
    }

    public void setProductOrderedQuantity(long productOrderedQuantity) {
        this.productOrderedQuantity = productOrderedQuantity;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
