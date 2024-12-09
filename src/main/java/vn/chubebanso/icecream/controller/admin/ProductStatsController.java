package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.ProductStats;
import vn.chubebanso.icecream.service.StatsService;

@RestController
public class ProductStatsController {
    private final StatsService statsService;

    public ProductStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // stats 1 product bất kì
    @GetMapping("/product-stats")
    public ResponseEntity<ProductStats> getProductStats(@RequestParam("name") String productName) {
        return ResponseEntity.ok(this.statsService.getProductStats(productName));
    }

    // stats tất cả product
    @GetMapping("/product-stats/all")
    public ResponseEntity<List<ProductStats>> getAllProductStats() {
        return ResponseEntity.ok(this.statsService.getAllProductStats());
    }

    // nhận Long cho Repo
    @GetMapping("/product-stats/{stats_id}")
    public ResponseEntity<ProductStats> getProductStatsById(@PathVariable("product_id") long product_id) {
        return ResponseEntity.ok(this.statsService.findProductStatsById(product_id));
    }
}
