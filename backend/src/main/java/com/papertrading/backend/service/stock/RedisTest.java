package com.papertrading.backend.service.stock;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;


@Component
public class RedisTest {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @PostConstruct
    public void test() {

        redisTemplate.opsForValue()
                .set("test","hello redis");

        System.out.println(
                redisTemplate.opsForValue().get("test")
        );
    }
}