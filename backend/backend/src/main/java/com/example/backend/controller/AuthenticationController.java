package com.example.backend.controller;

import com.example.backend.dto.requset.*;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.AuthenticationResponse;
import com.example.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/auth")
public class AuthenticationController {
    AuthService authService;
    @PostMapping("/register")
    public APIResponse<?> register(@RequestBody @Valid UserRequest request){
        APIResponse<?> response = new APIResponse();
        response.setCode(200);
        response.setMessages("Đăng ký thành công!");
        authService.register(request);
        return response;

    }

    // Đăng nhập thường
    @PostMapping("/login")
    public APIResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request){
        AuthenticationResponse response = authService.login(request);
        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .messages("Đăng nhập thành công!")
                .data(response)
                .build();
    }

    // hàm quên mật khẩu
    @PutMapping("/forgot_password")
    public APIResponse<?> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request){
        APIResponse<?> response = new APIResponse();
        response.setCode(200);
        response.setMessages("Mật khẩu đã được đặt lại thành công!");
        authService.forgotPassword(request);
        return response;
    }


    // Đăng nhập bằng Google
    @PostMapping("/google-login")
    public APIResponse<AuthenticationResponse> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        AuthenticationResponse response = authService.loginWithGoogle(request.getIdToken());
        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .messages("Đăng nhập Google thành công!")
                .data(response)
                .build();
    }

    // Đăng nhập bằng Facebook
    @PostMapping("/facebook-login")
    public APIResponse<AuthenticationResponse> loginWithFacebook(@RequestBody FacebookLoginRequest request) {
        AuthenticationResponse response = authService.loginWithFacebook(request.getAccessToken());

        return APIResponse.<AuthenticationResponse>builder()
                .code(200)
                .messages("Đăng nhập Facebook thành công!")
                .data(response)
                .build();
    }



}
