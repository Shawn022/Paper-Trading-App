package com.papertrading.backend.dto.user;

import lombok.Getter;

@Getter
public class RegisterUserRequest {
    private String name;
    private String email;
    private String password;


}
