package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Product;
import vn.chubebanso.icecream.repository.ProductRepository;

@Service
public class ProductService{
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product handleCreateProduct(Product pr) {
        return this.productRepository.save(pr);
    }

    public List<Product> getAllProduct() {
        return this.productRepository.findAll();
    }

    public Product getProductById(Long product_id) {
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {
            Product pr = optionalProduct.get();
            return pr;
        } else {
            return null;
        }
    }

    public Product updateProduct(Long product_id, Product pr){
        Optional<Product> optionalProduct = this.productRepository.findById(product_id);
        if (optionalProduct.isPresent()) {        
            optionalProduct.get().setCategory(pr.getCategory()) ;
            optionalProduct.get().setName(pr.getName()) ;
            optionalProduct.get().setPrice(pr.getPrice());
            optionalProduct.get().setUnit(pr.getUnit());
            optionalProduct.get().setImage(pr.getImage());
            return this.productRepository.save(optionalProduct.get());
        } else {
            return null;
        }
    }

    public void deleteProductById(Long product_id){
        this.productRepository.deleteById(product_id);
    }
}