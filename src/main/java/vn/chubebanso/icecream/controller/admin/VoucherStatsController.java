package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.VoucherStats;
import vn.chubebanso.icecream.service.StatsService;

@RestController
public class VoucherStatsController {
    private final StatsService statsService;

    public VoucherStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // stats 1 Voucher bất kì
    @GetMapping("/voucher-stats")
    public ResponseEntity<VoucherStats> getVoucherStats(@RequestParam("voucher_name") String voucherName) {
        return ResponseEntity.ok(this.statsService.getVoucherStats(voucherName));
    }

    // stats tất cả Voucher
    @GetMapping("/voucher-stats/all")
    public ResponseEntity<List<VoucherStats>> getAllVoucherStats() {
        return ResponseEntity.ok(this.statsService.getAllVoucherStats());
    }

    // nhận Long cho Repo
    @GetMapping("/voucher-stats/{stats_id}")
    public ResponseEntity<VoucherStats> getVoucherStatsById(@PathVariable("voucher_id") long voucher_id) {
        return ResponseEntity.ok(this.statsService.findVoucherStatsById(voucher_id));
    }
}
