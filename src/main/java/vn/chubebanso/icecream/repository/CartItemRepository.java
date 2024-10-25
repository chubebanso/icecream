package vn.chubebanso.icecream.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.chubebanso.icecream.domain.CartItem;
import vn.chubebanso.icecream.domain.CartItemImp;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, CartItemImp>{  
}
