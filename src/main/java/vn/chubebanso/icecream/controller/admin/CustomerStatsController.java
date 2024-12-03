package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.CustomerStats;
import vn.chubebanso.icecream.service.StatsService;

@RestController
public class CustomerStatsController {
    private final StatsService statsService;

    public CustomerStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // stats 1 khách bất kì
    @GetMapping("/stats/customer-stats")
    public ResponseEntity<CustomerStats> getCustomerStats(@RequestParam("phonenum") String phonenum) {
        return ResponseEntity.ok(this.statsService.getCustomerStats(phonenum));
    }

    // stats tất cả khách
    @GetMapping("/stats/customer-stats/all")
    public ResponseEntity<List<CustomerStats>> getAllCustomerStats() {
        return ResponseEntity.ok(this.statsService.getAllCustomerStats());
    }

    // nhận Long cho Repo
    @GetMapping("/customer-stats/{stats_id}")
    public ResponseEntity<CustomerStats> getCustomerStatsById(@PathVariable("stats_id") long stats_id) {
        return ResponseEntity.ok(this.statsService.findCustomerStatsById(stats_id));
    }
}
