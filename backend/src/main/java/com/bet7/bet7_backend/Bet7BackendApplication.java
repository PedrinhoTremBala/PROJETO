package com.bet7.bet7_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Bet7BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(Bet7BackendApplication.class, args);
    }
}