package com.papertrading.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.papertrading.backend.service.AuthService;
import com.papertrading.backend.dto.user.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
     AuthResponse register(@RequestBody RegisterUserRequest request){
        return authService.register(request);
    }

    @PostMapping("/login")
    AuthResponse loginUser(@RequestBody LoginRequest request){
        return authService.loginUser(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {
        return authService.getCurrentUser(
                authentication.getName()
        );
    }

}
