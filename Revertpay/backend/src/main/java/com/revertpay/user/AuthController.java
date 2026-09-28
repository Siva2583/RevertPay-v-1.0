package com.revertpay.user;

import com.revertpay.dto.LoginRequest;
import com.revertpay.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(
            @RequestBody @Valid RegisterRequest request
    ) {
        authService.register(request);
        return "User registered Successfully!!";
    }

    @PostMapping("/login")
    public String login(
            @RequestBody @Valid LoginRequest loginRequest
    ) {
        return authService.verify(loginRequest);
    }
}