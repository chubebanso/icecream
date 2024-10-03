package vn.chubebanso.icecream.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import vn.chubebanso.icecream.domain.User;
import vn.chubebanso.icecream.service.UserService;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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

    @DeleteMapping("/user/{user_id}")
    public ResponseEntity<Void> DeleteUser(@PathVariable Long user_id){
        this.userService.DeleteUserById(user_id);
        return ResponseEntity.noContent().build();
   }
}
