package vn.chubebanso.icecream.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<CartItem> items;

    @NotEmpty(message = "Tên sản phẩm không được để trống!")
    @Pattern(regexp = "^[A-Za-zÀ-ỹ\\s]+$", message = "Tên sản phẩm bị lỗi định dạng!")
    @Size(min = 2, message = "Tên sản phẩm phải có ít nhất 2 ký tự!")
    private String name;

    @PositiveOrZero
    private float price;

    @NotEmpty(message = "Unit cannot be empty")
    @Pattern(regexp = "ly|chai|chiếc|que|hộp", message = "Unit must be one of {ly, chai, chiếc, que, hộp}")
    private String unit;

    private String image;

    @NotEmpty(message = "Category cannot be empty")
    @Pattern(regexp = "Bánh trung thu|Nước|Kem", message = "Category must be one of {Bánh trung thu, Nước, Kem}")
    private String category;

    private boolean isHidden;

    public boolean isHidden() {
        return isHidden;
    }

    public void setHidden(boolean isHidden) {
        this.isHidden = isHidden;
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

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
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

}
