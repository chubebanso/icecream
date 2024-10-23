package vn.chubebanso.icecream.service;

import java.util.List;
import org.springframework.stereotype.Service;
import java.util.Optional;

import vn.chubebanso.icecream.domain.ProductCategory;
import vn.chubebanso.icecream.repository.CategoryRepository;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public ProductCategory handleCreateCategory(ProductCategory pc) {
        return this.categoryRepository.save(pc);
    }

    public List<ProductCategory> getAllCategory() {
        return this.categoryRepository.findAll();
    }

    public ProductCategory getCategoryById(Long category_id) {
        Optional<ProductCategory> optionalCategory = this.categoryRepository.findById(category_id);
        if (optionalCategory.isPresent()) {
            ProductCategory pc = optionalCategory.get();
            return pc;
        } else {
            return null;
        }
    }

    public ProductCategory updateCategory(Long category_id, ProductCategory pc) {
        Optional<ProductCategory> optionalCategory = this.categoryRepository.findById(category_id);
        if (optionalCategory.isPresent()) {
            optionalCategory.get().setCategoryName(pc.getCategoryName());
            return this.categoryRepository.save(optionalCategory.get());
        } else {
            return null;
        }
    }

    public void deleteCategoryById(Long category_id) {
        this.categoryRepository.deleteById(category_id);
    }
}
