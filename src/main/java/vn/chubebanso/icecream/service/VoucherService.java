package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Voucher;
import vn.chubebanso.icecream.repository.VoucherRepository;

@Service
public class VoucherService {

    private final VoucherRepository voucherRepo;

    public VoucherService(VoucherRepository voucherRepo) {
        this.voucherRepo = voucherRepo;
    }

    // tạo Voucher mới
    public Voucher handleCreateVoucher(Voucher voucher) {
        return this.voucherRepo.save(voucher);
    }

    // lấy hết voucher (có thể để show trong trang Voucher của Admin + Client)
    public List<Voucher> getAllVoucher() {
        return this.voucherRepo.findAll();
    }

    // xóa Voucher = ID
    public void deleteVoucherById(Long voucher_id) {
        this.voucherRepo.deleteById(voucher_id);
    }

    // hệ thống tìm voucher = ID
    public Voucher getVoucherById(Long voucher_id) {
        Optional<Voucher> optionalVoucher = this.voucherRepo.findById(voucher_id);
        if (optionalVoucher.isPresent()) {
            Voucher voucher = optionalVoucher.get();
            return voucher;
        } else {
            return null;
        }
    }
}
