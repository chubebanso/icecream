package vn.chubebanso.icecream.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import vn.chubebanso.icecream.domain.Meta;
import vn.chubebanso.icecream.domain.ResultPaginationDTO;
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

    public ResultPaginationDTO getAllUser(Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(pageable);

        Meta meta = new Meta();
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();

        meta.setPage(pageUser.getNumber());
        meta.setPageSize(pageUser.getSize());
        meta.setPages(pageUser.getTotalPages());
        meta.setTotalPage(pageUser.getNumberOfElements());
        resultPaginationDTO.setMeta(meta);
        resultPaginationDTO.setResult(pageUser.getContent());

        return resultPaginationDTO;
    }

    public List<User> getEveryUser() {
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

    public User updateUser(Long user_id, User user) {
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

    public void deleteUserById(Long user_id) {
        this.userRepository.deleteById(user_id);
    }

    public User getUserByUserName(String email) {
        return this.userRepository.findByEmail(email);
    }
}
