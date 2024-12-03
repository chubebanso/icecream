package vn.chubebanso.icecream.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Voucher;
import vn.chubebanso.icecream.domain.VoucherStats;
import vn.chubebanso.icecream.domain.VoucherValueStats;
import vn.chubebanso.icecream.repository.VoucherRepository;
import vn.chubebanso.icecream.repository.VoucherStatsRepository;
import vn.chubebanso.icecream.repository.VoucherValueStatsRepository;

@Service
public class VoucherService {
    private final VoucherRepository voucherRepo;
    private final VoucherStatsRepository voucherStatsRepository;
    private final VoucherValueStatsRepository voucherValueStatsRepository;
    private final StatsService statsService;

    public VoucherService(VoucherRepository voucherRepo, VoucherStatsRepository voucherStatsRepository,
            StatsService statsService, VoucherValueStatsRepository voucherValueStatsRepository) {
        this.voucherRepo = voucherRepo;
        this.voucherStatsRepository = voucherStatsRepository;
        this.statsService = statsService;
        this.voucherValueStatsRepository = voucherValueStatsRepository;
    }

    // tạo Voucher mới
    public Voucher handleCreateVoucher(Voucher voucher) {

        Instant instant = Instant.now();
        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");

        // Ngày tạo Voucher với múi giờ Việt Nam
        ZonedDateTime createdDate = instant.atZone(zone);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        DateTimeFormatter f = DateTimeFormatter.ofPattern("MM");

        // Thiết lập ngày tạo Voucher
        voucher.setCreatedDate(createdDate.format(formatter));

        // Lấy ngày cuối cùng của tháng
        ZonedDateTime endOfMonth = createdDate.with(TemporalAdjusters.lastDayOfMonth());

        // Tính số ngày còn lại trong tháng
        long daysLeftInMonth = ChronoUnit.DAYS.between(createdDate, endOfMonth);

        if (voucher.getVoucherType() != null)
            switch (voucher.getVoucherType()) {
                // ngày Voucher hết hạn là số ngày còn lại trong tháng mà Voucher được tạo
                case "Khuyến mãi hàng tháng" ->
                    voucher.setExpiredDate(createdDate.plus(daysLeftInMonth, ChronoUnit.DAYS).format(formatter));
                // tương tự như cái đầu thì tao cộng vào ngày voucher được tạo
                case "Sinh nhật nhà hàng" ->
                    voucher.setExpiredDate(createdDate.plus(7, ChronoUnit.DAYS).format(formatter));
                case "Trung thu" -> voucher.setExpiredDate(createdDate.plus(14, ChronoUnit.DAYS).format(formatter));
                case "Tết Âm Lịch" ->
                    voucher.setExpiredDate(createdDate.plus(20, ChronoUnit.DAYS).format(formatter));
                case "Quốc Khánh" -> voucher.setExpiredDate(createdDate.plus(5, ChronoUnit.DAYS).format(formatter));
                case "30/4 - 1/5" -> voucher.setExpiredDate(createdDate.plus(10, ChronoUnit.DAYS).format(formatter));
            }

        Voucher newVoucher = this.voucherRepo.save(voucher);
        long discountAmount = (long) newVoucher.getDiscountAmount();
        long id = newVoucher.getId();

        id = (id == 100) ? 0 : id;
        String customedName = "TT" + createdDate.format(f) +
                (id < 10 ? "0" + id : id) +
                (discountAmount < 10 ? "0" + discountAmount : discountAmount);
        newVoucher.setVoucherName(customedName);
        this.voucherRepo.save(newVoucher);

        VoucherStats voucherStats = this.voucherStatsRepository.findByVoucherName(customedName);
        float activationValue = newVoucher.getMinActivationValue();
        if (voucherStats == null) {
            this.statsService.createVoucherStats(customedName, activationValue, discountAmount);
        }

        long minActivationValue = (long) activationValue;
        VoucherValueStats voucherValueStats = this.voucherValueStatsRepository
                .findByMinActivationValue(minActivationValue);
        if (voucherValueStats == null) {
            this.statsService.createVoucherValueStats(minActivationValue);
        }
        return newVoucher;
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
