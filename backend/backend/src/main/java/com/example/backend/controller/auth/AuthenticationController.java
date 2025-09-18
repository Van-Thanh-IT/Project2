package com.example.backend.controller.auth;

import com.example.backend.dto.requset.AuthenticationRequest;
import com.example.backend.dto.requset.RegisterRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.AuthenticationResponse;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/auth")
public class AuthenticationController {
    AuthService authService;
    @PostMapping("/register")
    public APIResponse<?> register(@RequestBody @Valid RegisterRequest request){
        APIResponse<?> response = new APIResponse();
        response.setCode(200);
        response.setMessages("Đăng ký thành công!");
        authService.register(request);
        return response;
    }

    @PostMapping("/login")
    public APIResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request){
        var result = authService.login(request);

        return APIResponse.<AuthenticationResponse>builder()
                .data(result)
                .build();
    }



}
