package vn.chubebanso.icecream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.ProductStats;

@Repository
public interface ProductStatsRepository extends JpaRepository<ProductStats, Long> {
    ProductStats findByName(String name);
}
