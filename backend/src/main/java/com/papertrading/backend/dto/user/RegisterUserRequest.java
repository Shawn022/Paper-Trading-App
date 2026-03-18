package com.papertrading.backend.dto.user;

public class RegisterUserRequest {
    private String name;
    private String email;
    private String password;

    //getters

    public String getName(){
        return name;
    }

    public String getEmail(){
        return email;
    }

    public String getPassword(){
        return password;
    }
}
