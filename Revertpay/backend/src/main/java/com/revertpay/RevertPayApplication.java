package com.revertpay;

import com.revertpay.account.AccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class RevertPayApplication {

    public static void main(String[] args) {
        SpringApplication.run(RevertPayApplication.class, args);
    }
    @Bean
    CommandLineRunner createSystemAccount(AccountService accountService) {
        return args -> {
            accountService.createEscrowHoldingAccount();
        };
    }
}