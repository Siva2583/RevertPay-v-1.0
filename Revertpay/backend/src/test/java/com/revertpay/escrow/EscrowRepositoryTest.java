//package com.revertpay.escrow;
//
//import com.revertpay.user.Role;
//import com.revertpay.user.User;
//import com.revertpay.user.UserRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@SpringBootTest
//class EscrowRepositoryTest {
//
//    @Autowired
//    private EscrowRepository escrowRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    void saveEscrow() {
//
//        User buyer = new User(
//                "buyerrr@test.com",
//                "password123"
//        );
//        buyer.setRole(Role.BUYER);
//
//        User seller = new User(
//                "sellerrr@test.com",
//                "password123"
//        );
//        seller.setRole(Role.SELLER);
//
//        User savedBuyer = userRepository.save(buyer);
//        User savedSeller = userRepository.save(seller);
//
//        EscrowTransaction escrow = new EscrowTransaction();
//
//        escrow.setBuyer(savedBuyer);
//        escrow.setSeller(savedSeller);
//        escrow.setItemName("Laptop");
//        escrow.setAmount(new BigDecimal("50000"));
//        escrow.setStatus(EscrowStatus.CREATED);
//        escrow.setCreatedAt(LocalDateTime.now());
//        escrow.setIdempotencyKey("TEST-ESCROW-00100");
//        escrow.setRequestHash("test-hash");
//
//        EscrowTransaction savedEscrow =
//                escrowRepository.save(escrow);
//
//        System.out.println("ESCROW ID: " + savedEscrow.getId());
//        System.out.println("BUYER ID: " + savedEscrow.getBuyer().getId());
//        System.out.println("SELLER ID: " + savedEscrow.getSeller().getId());
//        System.out.println("AMOUNT: " + savedEscrow.getAmount());
//        System.out.println("STATUS: " + savedEscrow.getStatus());
//    }
//}