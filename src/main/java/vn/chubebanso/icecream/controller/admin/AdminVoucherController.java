package vn.chubebanso.icecream.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.Voucher;
import vn.chubebanso.icecream.service.VoucherService;
import vn.chubebanso.icecream.util.error.IdInvalidException;

@RestController

class AdminVoucherController {

    private final VoucherService voucherService;

    public AdminVoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping("/voucher")
    public ResponseEntity<List<Voucher>> getAllVoucher() {
        return ResponseEntity.ok(this.voucherService.getAllVoucher());
    }

    @PostMapping("/create/voucher")
    public ResponseEntity<Voucher> createVoucherController(@RequestBody Voucher voucher) {
        Voucher newVoucher = this.voucherService.handleCreateVoucher(voucher);
        return ResponseEntity.ok(newVoucher);
    }

    @DeleteMapping("/delete/voucher")
    public ResponseEntity<Void> deleteVoucherById(@PathVariable("voucher_id") long voucher_id)
            throws IdInvalidException {
        if (voucher_id > 1500) {
            throw new vn.chubebanso.icecream.util.error.IdInvalidException("Khong tim thay voucher");
        }
        this.voucherService.deleteVoucherById(voucher_id);
        return ResponseEntity.noContent().build();
    }
}