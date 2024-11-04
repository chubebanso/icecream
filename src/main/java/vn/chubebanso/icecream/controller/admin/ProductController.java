package vn.chubebanso.icecream.controller.admin;

import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.domain.ResultPaginationDTO;
import vn.chubebanso.icecream.service.ProductService;
import vn.chubebanso.icecream.util.error.IdInvalidException;

@RestController
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/create/product")
    public ResponseEntity<Product> createProductController(@Valid @RequestBody Product pr) {
        Product newProduct = this.productService.handleCreateProduct(pr);
        return ResponseEntity.ok(newProduct);
    }

    @GetMapping("/product")
    public ResponseEntity<ResultPaginationDTO> getAllProduct(@RequestParam("current") Optional<String> currentOptional,
            @RequestParam("pageSize") Optional<String> pasizeOptional) {
        String sCurrentPage = currentOptional.isPresent() ? currentOptional.get() : "";
        String sPagesize = pasizeOptional.isPresent() ? pasizeOptional.get() : "";
        int currentPage = Integer.parseInt(sCurrentPage);
        int pageSize = Integer.parseInt(sPagesize);
        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);
        return ResponseEntity.ok(this.productService.getAllProduct(pageable));
    }

    @GetMapping("/product/{product_id}")
    public ResponseEntity<Product> getProductById(@PathVariable("product_id") Long product_id) {
        return ResponseEntity.ok(this.productService.getProductById(product_id));
    }

    @PutMapping("/update/product/{product_id}")
    public ResponseEntity<Product> updateProductInfo(@Valid @RequestBody Product pr,
            @PathVariable("product_id") Long productId) {
        return ResponseEntity.ok(this.productService.updateProduct(productId, pr));
    }

    @DeleteMapping("/delete/product/{product_id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("product_id") Long product_id)
            throws IdInvalidException {
        if (product_id > 1500) {
            throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay product");
        }
        this.productService.deleteProductById(product_id);
        return ResponseEntity.noContent().build();
    }
}
