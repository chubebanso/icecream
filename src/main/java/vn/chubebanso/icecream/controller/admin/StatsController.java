package vn.chubebanso.icecream.controller.admin;

import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.service.StatsService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class StatsController {
    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/total-spent")
    public ResponseEntity<Float> getTotalSpent(@RequestBody @RequestParam("phonenum") String phonenum) {
        return ResponseEntity.ok(this.statsService.getTotalSpentByPhonenum(phonenum));
    }

    @GetMapping("/total-orders")
    public ResponseEntity<Long> getTotalOrders(@RequestBody @RequestParam("phonenum") String phonenum) {
        return ResponseEntity.ok(this.statsService.getTotalOrdersByPhonenum(phonenum));
    }

}
