package com.revertpay.common;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/testy")
@CrossOrigin(origins = "http://localhost:5173")
public class TestyController {
    @PostMapping
    public String test(@RequestBody String message) {
        return "Backend received: " + message;
    }
}