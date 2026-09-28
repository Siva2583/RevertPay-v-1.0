//package com.revertpay.user;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//class UserRepositoryTest {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    void saveUser() {
//
//        User user = new User(
//                "shiva@test.com",
//                "password123"
//        );
//
//        User savedUser = userRepository.save(user);
//
//        System.out.println("ID: " + savedUser.getId());
//        System.out.println("EMAIL: " + savedUser.getEmail());
//    }
//}