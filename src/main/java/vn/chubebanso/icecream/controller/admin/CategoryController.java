package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.chubebanso.icecream.domain.ProductCategory;
import vn.chubebanso.icecream.service.CategoryService;
import vn.chubebanso.icecream.util.error.IdInvalidException;

@RestController
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/create/category")
    public ResponseEntity<ProductCategory> createCategoryController(@Valid @RequestBody ProductCategory pc) {
        ProductCategory newPc = this.categoryService.handleCreateCategory(pc);
        return ResponseEntity.ok(newPc);
    }

    @GetMapping("/category")
    public ResponseEntity<List<ProductCategory>> getAllCategory() {
        return ResponseEntity.ok(this.categoryService.getAllCategory());
    }

    @GetMapping("/category/{category_id}")
    public ResponseEntity<ProductCategory> getCategoryById(@Valid @RequestBody @PathVariable Long category_id) {
        return ResponseEntity.ok(this.categoryService.getCategoryById(category_id));
    }

    @PutMapping("/update/category/{category_id}")
    public ResponseEntity<ProductCategory> updateProductInfo(@Valid @RequestBody ProductCategory pc, @PathVariable Long category_id) {
        return ResponseEntity.ok(this.categoryService.updateCategory(category_id, pc));
    }

    @DeleteMapping("/delete/category/{category_id}")
    public ResponseEntity<Void> deleteCategory(@Valid @PathVariable Long category_id)
            throws IdInvalidException {
        if (category_id > 1500) {
            throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay category");
        }
        this.categoryService.deleteCategoryById(category_id);
        return ResponseEntity.noContent().build();
    }
}
