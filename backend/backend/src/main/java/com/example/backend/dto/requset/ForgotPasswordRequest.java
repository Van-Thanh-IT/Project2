package com.example.backend.dto.requset;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống!")
    @Size(min = 8,message = "Mật khẩu có ít nhất 8 ký tự!")
    @Size(max = 20, message = "Mật khẩu không quá 20 ký tự!")
    private String password;

    @NotBlank
    private String confirmPassword;
}
