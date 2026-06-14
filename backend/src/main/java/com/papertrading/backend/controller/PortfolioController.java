package com.papertrading.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.papertrading.backend.portfolio.Portfolio;
import com.papertrading.backend.dto.portfolio.*;
import com.papertrading.backend.service.PortfolioService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/portfolio")
    public PortfolioResponse getPortfolio(Authentication authentication){
        System.out.println("Portfolio fetched");
        return portfolioService.getPortfolio(authentication.getName());
    }
}
