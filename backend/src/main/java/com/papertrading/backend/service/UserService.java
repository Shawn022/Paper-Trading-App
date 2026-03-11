package com.papertrading.backend.service;

import com.papertrading.backend.dto.LoginRequest;
import com.papertrading.backend.dto.RegisterUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.papertrading.backend.user.User;
import com.papertrading.backend.user.UserRepository;

//import com.papertrading.backend.dto.RegisterUserRequest;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public void registerUser(RegisterUserRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User already exists"
            );
        }

        User user = new User(request.getName(),request.getEmail(),request.getPassword());
        userRepository.save(user);
    }

    public User loginUser(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid password"
            );
        }
        return user;

    }
}
