package vn.chubebanso.icecream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.VoucherValueStats;

@Repository
public interface VoucherValueStatsRepository extends JpaRepository<VoucherValueStats, Long> {
    VoucherValueStats findByMinActivationValue(Long minActivationValue);
}
