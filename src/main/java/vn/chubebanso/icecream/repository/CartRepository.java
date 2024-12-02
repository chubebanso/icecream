package vn.chubebanso.icecream.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.Cart;


@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findAllByPhonenum(String phonenum);
}
