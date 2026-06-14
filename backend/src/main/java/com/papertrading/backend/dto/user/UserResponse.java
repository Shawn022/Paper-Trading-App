package com.papertrading.backend.dto.user;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private BigDecimal balance;
    private BigDecimal realisedPnL;

    public UserResponse(
            Long id,
            String name,
            String email,
            BigDecimal balance,
            BigDecimal realisedPnL
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.balance = balance;
        this.realisedPnL = realisedPnL;
    }

}
