package vn.chubebanso.icecream.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.User;
import vn.chubebanso.icecream.repository.UserRepository;
import vn.chubebanso.icecream.service.UserService;
import vn.chubebanso.icecream.util.error.IdInvalidException;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String helloWorld() throws IdInvalidException {

        if (true) {
            throw new IdInvalidException("login error");
        }
        return "Hello chubebanso";
    }

    public String getMethodName(@RequestParam String param) {
        return new String();
    }

    @PostMapping("/create/user")
    public ResponseEntity<User> createUserController(@RequestBody User user) {
        User newUser = this.userService.handleCreateUser(user);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/user")
    public ResponseEntity<List<User>> getAllUser() {
        return ResponseEntity.ok(this.userService.getAllUser());
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<User> getUserById(@RequestBody @PathVariable Long user_id) {
        return ResponseEntity.ok(this.userService.getUserById(user_id));
    }

    @PutMapping("/update/user/{user_id}")
    public ResponseEntity<User> UpdateUserInfo(@RequestBody User user, @PathVariable Long user_id) {
        return ResponseEntity.ok(this.userService.UpdateUser(user_id, user));
    }

    @DeleteMapping("/delete/user/{user_id}")
    public ResponseEntity<Void> DeleteUser(@PathVariable Long user_id) throws IdInvalidException {
        if (user_id > 1500) {
            throw new IdInvalidException("Khong tim thay user");
        }
        this.userService.DeleteUserById(user_id);
        return ResponseEntity.noContent().build();
    }
}
