package vn.chubebanso.icecream.controller.admin;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.chubebanso.icecream.domain.ResultPaginationDTO;
import vn.chubebanso.icecream.domain.User;
import vn.chubebanso.icecream.service.UserService;
import vn.chubebanso.icecream.util.error.IdInvalidException;

@RestController
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/")
    public String helloWorld() throws IdInvalidException {

        if (true) {
            throw new IdInvalidException("login error");
        }
        return "Hello chubebanso";
    }

    @PostMapping("/create/user")
    public ResponseEntity<User> createUserController(@Valid @RequestBody User user) {
        String hashPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);
        User newUser = this.userService.handleCreateUser(user);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/user")
    public ResponseEntity<ResultPaginationDTO> getAllUser(@RequestParam("current") Optional<String> currentOptional,
            @RequestParam("pageSize") Optional<String> pasizeOptional) {
        String sCurrentPage = currentOptional.isPresent() ? currentOptional.get() : "";
        String sPagesize = pasizeOptional.isPresent() ? pasizeOptional.get() : "";
        int currentPage = Integer.parseInt(sCurrentPage);
        int pageSize = Integer.parseInt(sPagesize);
        Pageable pageable = PageRequest.of(currentPage - 1, pageSize);
        return ResponseEntity.ok(this.userService.getAllUser(pageable));
    }

    @GetMapping("/all-user")
    public ResponseEntity<List<User>> getEveryUser() {
        return ResponseEntity.ok(this.userService.getEveryUser());
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<User> getUserById(@Valid @RequestBody @PathVariable Long user_id) {
        return ResponseEntity.ok(this.userService.getUserById(user_id));
    }

    @PutMapping("/update/user/{user_id}")
    public ResponseEntity<User> UpdateUserInfo(@Valid @RequestBody User user, @PathVariable Long user_id) {
        return ResponseEntity.ok(this.userService.updateUser(user_id, user));
    }

    @DeleteMapping("/delete/user/{user_id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long user_id) throws IdInvalidException {
        if (user_id > 1500) {
            throw new IdInvalidException("Khong tim thay user");
        }
        this.userService.deleteUserById(user_id);
        return ResponseEntity.noContent().build();
    }
}
