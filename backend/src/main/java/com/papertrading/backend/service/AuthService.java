package com.papertrading.backend.service;

import com.papertrading.backend.dto.user.AuthResponse;
import com.papertrading.backend.dto.user.LoginRequest;
import com.papertrading.backend.dto.user.RegisterUserRequest;
import com.papertrading.backend.dto.user.UserResponse;
import com.papertrading.backend.exception.DuplicateEmailException;
import com.papertrading.backend.exception.ResourceNotFoundException;
import com.papertrading.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.papertrading.backend.user.User;
import com.papertrading.backend.user.UserRepository;

import java.math.BigDecimal;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterUserRequest request)throws ResponseStatusException{
        if(userRepository.existsByEmail(request.getEmail())){
            throw new DuplicateEmailException("Email already registered: "+ request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setBalance(new BigDecimal("100000.00"));
        user.setRealisedPnL(new BigDecimal("0.00"));
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token);
    }

    public AuthResponse loginUser(LoginRequest request) throws ResponseStatusException{
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String token =
                jwtUtil.generateToken(
                        request.getEmail()
                );

        return new AuthResponse(token);

    }

    public UserResponse getCurrentUser(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with email: "+ email));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBalance(),
                user.getRealisedPnL()
        );
    }

}
