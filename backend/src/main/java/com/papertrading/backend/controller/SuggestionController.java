package com.papertrading.backend.controller;

import com.papertrading.backend.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.papertrading.backend.customs.StockScore;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/suggestion")
public class SuggestionController {
    @Autowired
    private SuggestionService suggestionService;


}
