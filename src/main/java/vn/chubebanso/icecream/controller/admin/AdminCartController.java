package vn.chubebanso.icecream.controller.admin;

import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.ResultPaginationDTO;
import vn.chubebanso.icecream.service.CartService;

@RestController
public class AdminCartController {

    private final CartService cartService;

    public AdminCartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Admin show all cart => mục đích thống kê/báo cáo
    @GetMapping("/cart")
    public ResponseEntity<ResultPaginationDTO> findAllCart(@RequestParam("current") Optional<String> currentOptional,
            @RequestParam("pageSize") Optional<String> pasizeOptional) {
        String sCurrentPage = currentOptional.isPresent() ? currentOptional.get() : "";
        String sPagesize = pasizeOptional.isPresent() ? pasizeOptional.get() : "";
        int currentPage = Integer.parseInt(sCurrentPage);
        int pageSize = Integer.parseInt(sPagesize);
        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);
        return ResponseEntity.ok(this.cartService.findAllCart(pageable));
    }
}
