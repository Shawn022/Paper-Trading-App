package com.papertrading.backend.controller;

import com.papertrading.backend.portfolio.Portfolio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.papertrading.backend.service.PortfolioService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/{userId}/portfolio")
    public List<Portfolio> getPortfolio(@PathVariable Long userId){
        return portfolioService.getPortfolio(userId);
    }
}
