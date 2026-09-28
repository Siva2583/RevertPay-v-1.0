package com.revertpay.escrow;

import com.revertpay.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class EscrowTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    private String itemName;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EscrowStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime shippedAt;

    private LocalDateTime autoReleaseAt;

    private LocalDateTime resolvedAt;

    private String resolution;

    @Column(nullable = false, unique = true)
    private String idempotencyKey;

    private String requestHash;

    @Version
    private Long version;

    private LocalDateTime confirmationDeadline;
    public Long getBuyerId(EscrowTransaction transaction){
        return transaction.getBuyer().getId();
    }

}