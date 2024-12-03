package vn.chubebanso.icecream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.CustomerStats;

@Repository
public interface CustomerStatsRepository extends JpaRepository<CustomerStats, Long> {
    CustomerStats findStatsByPhonenum(String phonenum);
}
