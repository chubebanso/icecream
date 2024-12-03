package vn.chubebanso.icecream.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import vn.chubebanso.icecream.domain.CategoryStats;

public interface CategoryStatsRepository extends JpaRepository<CategoryStats, Long> {
    CategoryStats findByProductCategory(String productCategory);
}
