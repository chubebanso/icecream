package vn.chubebanso.icecream.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.Voucher;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findAllByPhonenum(String phonenum);

    @Query("SELECT c FROM Cart c JOIN c.items ci WHERE ci = :cartItem")
    Cart findCartByCartItem(CartItem cartItem);

    List<Cart> findAllByVoucher(Voucher voucher);

    List<Cart> findAllByCreatedAt(Date createdAt);
}
