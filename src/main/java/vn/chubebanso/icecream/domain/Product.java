package vn.chubebanso.icecream.domain;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "product")
    private List<CartItem> items;

    @NotEmpty(message = "Name cannot be empty")
    @Pattern(regexp = "^[A-Za-z0-9_-]+$", message = "Invalid name format")
    @Size(min = 2, message = "Name must have at least 2 characters")
    private String name;

    @NotNull
    private float price;

    @NotEmpty(message = "Unit cannot be empty")
    @Pattern(regexp = "ly|chai|chiếc|que|hộp", message = "Unit must be one of {ly, chai, chiếc, que, hộp}")
    private String unit;

    private boolean IsAvailableForOrder = true;

    private String image;

    @NotEmpty(message = "Category cannot be empty")
    @Pattern(regexp = "bánh trung thu|nước|kem", message = "Category must be one of {bánh trung thu, nước, kem}")
    private String category;

    public boolean isIsAvailableForOrder() {
        return IsAvailableForOrder;
    }

    public void setIsAvailableForOrder(boolean isAvailableForOrder) {
        IsAvailableForOrder = isAvailableForOrder;
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

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

}
