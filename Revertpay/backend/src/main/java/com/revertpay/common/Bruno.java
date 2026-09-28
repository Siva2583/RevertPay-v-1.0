package com.revertpay.common;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bruno")
@CrossOrigin(origins = "http://localhost:5173")
public class Bruno {

    private final BrunoService brunoService;

    public Bruno(BrunoService brunoService) {
        this.brunoService = brunoService;
    }

    @PostMapping
    public String hellob() {
        return brunoService.sayHello();
    }
}