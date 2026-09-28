package com.revertpay.escrow;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EscrowRepository extends JpaRepository<EscrowTransaction,Long> {
    Optional<EscrowTransaction> findByIdempotencyKey(String idempotencyKey);
    //Optional<EscrowTransaction> findBy

    List<EscrowTransaction> findByBuyerId(Long buyerId);

    List<EscrowTransaction> findBySellerId(Long sellerId);
    EscrowTransaction findById(long escrowId);
    List<EscrowTransaction> findByStatus(EscrowStatus status);



}
