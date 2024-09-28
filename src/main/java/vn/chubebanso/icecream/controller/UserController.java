package vn.chubebanso.icecream.controller;

import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.User;
import vn.chubebanso.icecream.service.UserService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class UserController {
    final private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create/user")
    public ResponseEntity<User> createUserController(@RequestBody User user) {
        User newUser = this.userService.handleCreateUser(user);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/user")
    public List<User> getAllUser() {
        return this.userService.getAllUser();
    }

    @GetMapping("/user/{user_id}")
    public User getUserById(@PathVariable Long user_id) {
        return this.userService.getUserById(user_id);
    }

}
