package com.revertpay.dto;

import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
@Setter
@Getter
@NoArgsConstructor
public class EscrowInitiateRequest {
    @NonNull
    private String sellerAccountNumber;
    @NonNull
    private String itemName;
    @NonNull
    @Positive
    private BigDecimal amount;

}
