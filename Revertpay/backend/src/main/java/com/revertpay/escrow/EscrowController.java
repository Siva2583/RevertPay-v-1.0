package com.revertpay.escrow;

import com.revertpay.dto.EscrowInitiateRequest;
import com.revertpay.dto.EscrowInitiateResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/escrow")
public class EscrowController {

    private final EscrowService escrowService;

    public EscrowController(EscrowService escrowService) {
        this.escrowService = escrowService;
    }
    @GetMapping("/buyer")
    public List<EscrowTransaction> getBuyerTransactions(HttpServletRequest req){
        String authHeader =req.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Missing Authorization header!!");
        }
        String token=authHeader.substring(7);
        List<EscrowTransaction> l=escrowService.getTransactions(token,"buyer");
        return l;
    }
    @GetMapping("/seller")
    public List<EscrowTransaction> getSellerTransactions(HttpServletRequest req){
        String authHeader =req.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Missing Authorization header!!");
        }
        String token=authHeader.substring(7);
        List<EscrowTransaction> l=escrowService.getTransactions(token,"seller");
        return l;


    }
    @PostMapping("{id}/confirm-delivery")
    public void EscrowConfirm(@PathVariable Long id,HttpServletRequest req){
        String authHeader =req.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Missing Authorization header!!");
        }
        String token=authHeader.substring(7);
        escrowService.confirmEscrow(id,token);
    }
    @PostMapping("/{id}/ship")
    public void EscrowInitiateShip(@PathVariable Long id,HttpServletRequest req){
        String authHeader =req.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Missing Authorization header!!");
        }
        String token=authHeader.substring(7);
        escrowService.shipTransaction(id,token);

    }
    @PostMapping("/{id}/fund")
    public EscrowInitiateResponse fundTransaction(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }

        String token = authHeader.substring(7);

        return escrowService.fundTransaction(id, token);
    }
    @PostMapping("/{id}/cancel")
    public EscrowInitiateResponse cancelTransaction(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }
        String token = authHeader.substring(7);
        return escrowService.cancelTransaction(id, token);
    }
    @PostMapping("/{id}/confirm")
    public EscrowInitiateResponse confirmTransaction(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }
        String token = authHeader.substring(7);
        return escrowService.confirmTransaction(id, token);
    }

    @PostMapping("/initiate")
    public EscrowInitiateResponse initiate(
            @RequestBody @Valid EscrowInitiateRequest req,
            HttpServletRequest request
    ) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }

        String token = authHeader.substring(7);

        String idempotencyKey = request.getHeader("Idempotency-Key");

        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new RuntimeException("Idempotency-Key header missing");
        }

        return escrowService.transactionRequest(req, token, idempotencyKey);
    }
}
