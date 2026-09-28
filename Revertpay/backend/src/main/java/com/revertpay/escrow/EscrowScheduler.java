package com.revertpay.escrow;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EscrowScheduler {

    private final EscrowRepository escrowRepository;
    private final EscrowService escrowService;

    public EscrowScheduler(
            EscrowRepository escrowRepository,
            EscrowService escrowService
    ) {
        this.escrowRepository = escrowRepository;
        this.escrowService = escrowService;
    }

    @Scheduled(fixedRate = 5000)
    public void expireEscrows() {

        List<EscrowTransaction> transactions =
                escrowRepository.findByStatus(EscrowStatus.PAYMENT_INITIATED);

        for (EscrowTransaction transaction : transactions) {
            escrowService.checkExpiry(transaction.getId());
        }
    }
}