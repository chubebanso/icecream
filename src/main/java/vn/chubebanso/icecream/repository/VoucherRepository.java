package vn.chubebanso.icecream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.Voucher;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Voucher findByVoucherName(String voucherName);

    List<Voucher> findByMinActivationValue(float minActivationValue);
}
