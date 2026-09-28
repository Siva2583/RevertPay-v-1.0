package com.revertpay.escrow;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class EscrowStatusLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "escrow_id", nullable = false)
    private EscrowTransaction escrowTransaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EscrowStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EscrowStatus toStatus;

    private Long actorId;

    private String reason;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public Long getId() {
        return id;
    }

    public EscrowTransaction getEscrowTransaction() {
        return escrowTransaction;
    }

    public void setEscrowTransaction(EscrowTransaction escrowTransaction) {
        this.escrowTransaction = escrowTransaction;
    }

    public EscrowStatus getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(EscrowStatus fromStatus) {
        this.fromStatus = fromStatus;
    }

    public EscrowStatus getToStatus() {
        return toStatus;
    }

    public void setToStatus(EscrowStatus toStatus) {
        this.toStatus = toStatus;
    }

    public Long getActorId() {
        return actorId;
    }

    public void setActorId(Long actorId) {
        this.actorId = actorId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}