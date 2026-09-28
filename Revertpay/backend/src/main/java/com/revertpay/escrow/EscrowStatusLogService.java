package com.revertpay.escrow;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EscrowStatusLogService {

    private final EscrowStatusLogRepository logRepository;

    public EscrowStatusLogService(EscrowStatusLogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void logTransition(
            EscrowTransaction transaction,
            EscrowStatus fromStatus,
            EscrowStatus toStatus,
            Long actorId,
            String reason
    ) {

        EscrowStatusLog log = new EscrowStatusLog();

        log.setEscrowTransaction(transaction);
        log.setFromStatus(fromStatus);
        log.setToStatus(toStatus);
        log.setActorId(actorId);
        log.setReason(reason);
        log.setTimestamp(LocalDateTime.now());

        logRepository.save(log);
    }
}