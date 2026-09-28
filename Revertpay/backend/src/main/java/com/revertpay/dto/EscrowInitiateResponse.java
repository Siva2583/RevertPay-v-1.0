package com.revertpay.dto;

import com.revertpay.escrow.EscrowStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class EscrowInitiateResponse {

    public Long escrowid;
    @NotBlank
    public String sellername;
    @NotBlank
    public String itemName;
    @NotBlank
    @Positive
    public BigDecimal amount;
    @NotBlank
    public EscrowStatus status;
}
