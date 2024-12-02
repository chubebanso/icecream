package vn.chubebanso.icecream.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

}
