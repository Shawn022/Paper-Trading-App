package com.papertrading.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.papertrading.backend.user.*;
import com.papertrading.backend.portfolio.*;
import com.papertrading.backend.dto.portfolio.*;

import javax.sound.sampled.Port;
import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    public List<GetPortfolioResponse> getPortfolio(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "user nor found"
                ));
        return portfolioRepository.findByUser(user);
    }
}
