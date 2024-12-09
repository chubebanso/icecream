package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import vn.chubebanso.icecream.domain.VoucherValueStats;

import vn.chubebanso.icecream.service.StatsService;

@RestController
public class VoucherValueStatsController {
    private final StatsService statsService;

    public VoucherValueStatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/voucher-values/all")
    public ResponseEntity<List<VoucherValueStats>> getAllVoucherValueStats() {
        return ResponseEntity.ok(this.statsService.getAllVoucherValueStats());
    }

}
