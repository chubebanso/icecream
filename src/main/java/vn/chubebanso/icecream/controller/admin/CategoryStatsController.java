package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.CategoryStats;
import vn.chubebanso.icecream.service.StatsService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class CategoryStatsController {
    private final StatsService statsService;

    public CategoryStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/category/{stats_id}")
    public ResponseEntity<CategoryStats> getCategoryStatsById(@PathVariable("stats_id") long stats_id) {
        return ResponseEntity.ok(this.statsService.getCategoryStatsById(stats_id));
    }

    @GetMapping("/category/stats")
    public ResponseEntity<CategoryStats> getCategoryStats(@RequestParam("category") String category) {
        return ResponseEntity.ok(this.statsService.getCategoryStats(category));
    }

    @GetMapping("/category/stats/all")
    public ResponseEntity<List<CategoryStats>> getAllCategoryStats() {
        return ResponseEntity.ok(this.statsService.getAllCategoryStats());
    }
}
