package vn.chubebanso.icecream.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotEmpty(message = "Category ID cannot be empty")
    @Pattern(regexp = "^[0-9]+$", message = "Category ID must be a number")
    @Size(max = 10, message = "Category ID must have at most 10 digits")
    private String category_id;

    @NotEmpty(message = "Name cannot be empty")
    @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "Invalid name format")
    @Size(min = 2, message = "Name must have at least 2 characters")
    private String name;

    @NotEmpty(message = "Price cannot be empty")
    @Pattern(regexp = "^(\\d{1,3}(,\\d{3})*|\\d+)(VNĐ)$", message = "Price must be in the format '11500VNĐ'")
    private String price;

    @NotEmpty(message = "Unit cannot be empty")
    @Pattern(regexp = "ly|chai|chiếc|que|hộp", message = "Unit must be one of {ly, chai, chiếc, que, hộp}")
    private String unit;
    
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCategory_id() {
        return category_id;
    }

    public void setCategory_id(String category_id) {
        this.category_id = category_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }   
}
