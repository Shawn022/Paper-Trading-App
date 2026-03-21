package com.papertrading.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.papertrading.backend.user.User;
import com.papertrading.backend.service.UserService;
import com.papertrading.backend.dto.user.*;


@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    ResponseEntity<String>  registerUser(@RequestBody RegisterUserRequest request){
        userService.registerUser(request);

        return ResponseEntity.ok("user created successfully" );
    }

    @PostMapping("/login")
    User loginUser(@RequestBody LoginRequest request){
        return userService.loginUser(request);
    }

}
