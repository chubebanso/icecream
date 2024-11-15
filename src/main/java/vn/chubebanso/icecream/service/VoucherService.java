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

    // // tạo Voucher mới
    // public Voucher handleCreateVoucher(Voucher voucher) {

    //     Instant instant = Instant.now();
    //     ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");

    //     // Ngày tạo Voucher với múi giờ Việt Nam
    //     ZonedDateTime createdDate = instant.atZone(zone);

    //     // Thiết lập ngày tạo Voucher
    //     voucher.setCreatedDate(createdDate);

    //     // Lấy ngày cuối cùng của tháng
    //     ZonedDateTime endOfMonth = createdDate.with(TemporalAdjusters.lastDayOfMonth());

    //     // Tính số ngày còn lại trong tháng
    //     long daysLeftInMonth = ChronoUnit.DAYS.between(createdDate, endOfMonth);

    //     if (voucher.getVoucherType() != null)
    //         switch (voucher.getVoucherType()) {
    //             // ngày Voucher hết hạn là số ngày còn lại trong tháng mà Voucher được tạo
    //             case "Khuyến mãi hàng tháng" 
    //             -> voucher.setExpiredDate(voucher.getCreatedDate().plus(daysLeftInMonth, ChronoUnit.DAYS));
    //             // tương tự như cái đầu thì tao cộng vào ngày voucher được tạo
    //             case "Sinh nhật nhà hàng" -> voucher.setExpiredDate(voucher.getCreatedDate().plus(7, ChronoUnit.DAYS));
    //             case "Trung thu" -> voucher.setExpiredDate(voucher.getCreatedDate().plus(14, ChronoUnit.DAYS));
    //             case "Tết Âm Lịch" -> voucher.setExpiredDate(voucher.getCreatedDate().plus(20, ChronoUnit.DAYS));
    //             case "Quốc Khánh" -> voucher.setExpiredDate(voucher.getCreatedDate().plus(5, ChronoUnit.DAYS));
    //             case "30/4 - 1/5" -> voucher.setExpiredDate(voucher.getCreatedDate().plus(10, ChronoUnit.DAYS));
    //         }

    //     return this.voucherRepo.save(voucher);
    // }

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

    // chỉnh sửa Voucher để test API
    public Voucher updateVoucherById(Voucher voucher, Long voucher_id) {
        Optional<Voucher> optionalVoucher = this.voucherRepo.findById(voucher_id);
        if (optionalVoucher.isPresent()) {
            optionalVoucher.get().setVoucherType(voucher.getVoucherType());
            optionalVoucher.get().setVoucherName(voucher.getVoucherName());
            optionalVoucher.get().setDiscountAmount(voucher.getDiscountAmount());
            optionalVoucher.get().setMinActivationValue(voucher.getMinActivationValue());
            return this.voucherRepo.save(optionalVoucher.get());
        } else {
            return null;
        }
    }
}
