package com.example.backend.dto.requset;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    @NotBlank(message = "Họ tên người dùng không được để trống!")
    @Size(min = 8, message = "Họ tên phải có ít nhất 8 ký tự!")
    @Size(max = 30, message = "Họ tên không quá 30 ký tự")
    @Pattern(regexp = "^[a-zA-ZÀ-ỹ\\s]+$", message = "Họ tên chỉ được chứa chữ cái và khoảng trắng!")
    String fullName;
    @NotBlank(message = "Email không được để trống!")
    @Email(message = "Email không hợp lệ!")
    String email;

    @NotBlank(message = "Mật khẩu không được để trống!")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự!")
    String password;

    @NotBlank(message = "Vui lòng nhập lại mật khẩu!")
    String confirmPassword;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(0[0-9]{9,10})$", message = "Số điện thoại không hợp lệ!")
    String phone;

    boolean isActive;
}
