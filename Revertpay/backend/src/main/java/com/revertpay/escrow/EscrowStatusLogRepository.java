package com.revertpay.escrow;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EscrowStatusLogRepository extends JpaRepository<EscrowStatusLog, Long> {
}