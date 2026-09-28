package com.revertpay.escrow;

import org.springframework.stereotype.Service;

@Service
public class EscrowTransitionService {
    private final EscrowStatusLogService logService;

    public EscrowTransitionService(EscrowStatusLogService logService) {
        this.logService = logService;
    }

    public void transition(EscrowTransaction transaction,EscrowStatus new_status ,
                           Long actorId,
                           String reason) throws InvalidTransitionException {
        EscrowStatus cur_status=transaction.getStatus();
        if(!isValid(cur_status, new_status)){
            throw new InvalidTransitionException(
                    "Invalid transition: " + cur_status + " -> " + new_status
            );
        }
        transaction.setStatus(new_status);
        logService.logTransition(
                transaction,
                cur_status,
                new_status,
                actorId,
                reason
        );
    }
    private boolean isValid(EscrowStatus cur_status,EscrowStatus newStatus){
        return switch (cur_status){
            case PAYMENT_INITIATED ->
                    newStatus == EscrowStatus.CREATED
                            || newStatus == EscrowStatus.CANCELLED
                            || newStatus == EscrowStatus.EXPIRED;

            case CREATED ->
                    newStatus == EscrowStatus.FUNDED;

            case FUNDED ->
                    newStatus == EscrowStatus.SHIPPED;

            case SHIPPED ->
                    newStatus == EscrowStatus.RELEASED
                            || newStatus == EscrowStatus.UNDER_REVIEW;

            case UNDER_REVIEW ->
                    newStatus == EscrowStatus.RELEASED
                            || newStatus == EscrowStatus.REFUNDED;

            case CANCELLED, EXPIRED, RELEASED, REFUNDED ->
                    false;
        };
    }
}
