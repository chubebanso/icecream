package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.User;
import vn.chubebanso.icecream.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
    }

    public List<User> getAllUser() {
        return this.userRepository.findAll();
    }

    public User getUserById(Long user_id) {
        Optional<User> optionalUser = this.userRepository.findById(user_id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            return user;
        } else {
            return null;
        }
    }

    public User UpdateUser(Long user_id, User user) {
        Optional<User> optionalUser = this.userRepository.findById(user_id);
        if (optionalUser.isPresent()) {
            optionalUser.get().setEmail(user.getEmail());
            optionalUser.get().setUsername(user.getUsername());
            optionalUser.get().setPassword(user.getPassword());
            return this.userRepository.save(optionalUser.get());
        } else {
            return null;
        }
    }

    public void DeleteUserById(Long user_id) {
        this.userRepository.deleteById(user_id);
    }

    public User getUserByUserName(String email) {
        return this.userRepository.findByEmail(email);
    }
}
