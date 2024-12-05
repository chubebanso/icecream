package vn.chubebanso.icecream.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "category_stats")
public class CategoryStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String productCategory;
    private long productCategoryOrderedQuantity;
    private float productCategoryRevenue;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public long getProductCategoryOrderedQuantity() {
        return productCategoryOrderedQuantity;
    }

    public void setProductCategoryOrderedQuantity(long productCategoryOrderedQuantity) {
        this.productCategoryOrderedQuantity = productCategoryOrderedQuantity;
    }

    public float getProductCategoryRevenue() {
        return productCategoryRevenue;
    }

    public void setProductCategoryRevenue(float productCategoryRevenue) {
        this.productCategoryRevenue = productCategoryRevenue;
    }

}
