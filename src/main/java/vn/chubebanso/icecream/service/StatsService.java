package vn.chubebanso.icecream.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Cart;
import vn.chubebanso.icecream.repository.CartRepository;

@Service
public class StatsService {
    private final CartRepository cartRepo;

    public StatsService(CartRepository cartRepo) {
        this.cartRepo = cartRepo;
    }

    public float getTotalSpentByPhonenum(String phonenum) {
        List<Cart> carts = this.cartRepo.findAllByPhonenum(phonenum);
        float totalSpent = 0;
        for (Cart cart : carts) {
            totalSpent += cart.getNewTotal();
        }
        return totalSpent;
    }

    public long getTotalOrdersByPhonenum(String phonenum) {
        List<Cart> carts = this.cartRepo.findAllByPhonenum(phonenum);
        long ordersSum = 0;
        for (Cart cart : carts) {
            if (cart.getStatus() != null && cart.getStatus().equals("delivered")) {
                ordersSum++;
            }
        }
        return ordersSum;
    }
}
