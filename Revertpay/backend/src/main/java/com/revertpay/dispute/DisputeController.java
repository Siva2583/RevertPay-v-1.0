package com.revertpay.dispute;

import com.revertpay.dto.DisputeRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/escrow")
public class DisputeController {
    private final DisputeService disputeService;

    public DisputeController(DisputeService disputeService) {
        this.disputeService = disputeService;
    }

    @PostMapping("{id}/dispute")
    public void raiseDispute(@PathVariable Long id, HttpServletRequest req, @RequestBody DisputeRequest request){
        String authHeader =req.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            throw new RuntimeException("Missing Authorization header!!");
        }
        String token=authHeader.substring(7);
        disputeService.Underreview(token,id,request);
    }

}
