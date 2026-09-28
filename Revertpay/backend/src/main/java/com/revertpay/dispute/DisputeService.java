package com.revertpay.dispute;

import com.revertpay.dto.DisputeRequest;
import com.revertpay.escrow.EscrowRepository;
import com.revertpay.escrow.EscrowStatus;
import com.revertpay.escrow.EscrowTransaction;
import com.revertpay.escrow.EscrowTransitionService;
import com.revertpay.security.JwtService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final JwtService jwtService;
    private final EscrowRepository escrowRepository;
    private final EscrowTransitionService transitionService;

    public DisputeService(DisputeRepository disputeRepository, JwtService jwtService, EscrowRepository escrowRepository, EscrowTransitionService transitionService) {
        this.disputeRepository = disputeRepository;
        this.jwtService = jwtService;
        this.escrowRepository = escrowRepository;
        this.transitionService = transitionService;
    }
    public void Underreview(String token,Long id, DisputeRequest req){
        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        EscrowTransaction transaction = escrowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Escrow transaction not found"));
        Long buyer_id= jwtService.extractUserId(token);
        if(!(transaction.getBuyer().getId()).equals(buyer_id)){
            throw new RuntimeException("Invalid Buyer!!");
        }
        Dispute dispute=new Dispute();
        dispute.setTransaction(transaction);
        dispute.setStatus(DisputeStatus.OPENED);
        dispute.setCreatedAt(LocalDateTime.now());
        dispute.setReason(req.getReason());
        dispute.setDescription(req.getDescription());
        transitionService.transition(transaction,EscrowStatus.UNDER_REVIEW, buyer_id, "Customer review requested");
        escrowRepository.save(transaction);
        disputeRepository.save(dispute);



    }
}