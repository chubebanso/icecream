package vn.chubebanso.icecream.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.service.ProductService;
import vn.chubebanso.icecream.util.error.IdInvalidException;

@RestController
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/create/product")
    public ResponseEntity<Product> createUserController(@RequestBody Product pr) {
        Product newProduct = this.productService.handleCreateProduct(pr);
        return ResponseEntity.ok(newProduct);
    }

    @GetMapping("/product")
    public ResponseEntity<List<Product>> getAllProduct() {
        return ResponseEntity.ok(this.productService.getAllProduct());
    }

    @GetMapping("/product/{product_id}")
    public ResponseEntity<Product> getProductById(@RequestBody @PathVariable Long product_id) {
        return ResponseEntity.ok(this.productService.getProductById(product_id));
    }

    @PutMapping("/update/product/{product_id}")
    public ResponseEntity<Product> updateProductInfo(@RequestBody Product pr, @PathVariable Long product_id) {
        return ResponseEntity.ok(this.productService.updateProduct(product_id, pr));
    }

    @DeleteMapping("/delete/product/{product_id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long product_id)
            throws IdInvalidException {
        if (product_id > 1500) {
            throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay user");
        }
        this.productService.deleteProductById(product_id);
        return ResponseEntity.noContent().build();
    }
}