package com.papertrading.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.papertrading.backend.user.User;
import com.papertrading.backend.user.UserRepository;

import com.papertrading.backend.portfolio.Portfolio;
import com.papertrading.backend.portfolio.PortfolioRepository;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    public List<Portfolio> getPortfolio(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "user nor found"
                ));
        return portfolioRepository.findByUser(user);
    }
}
