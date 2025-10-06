package com.example.backend.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long userId;
    String fullName;
    String email;
    String phone;
    boolean isActive;
    LocalDateTime createdAt;
     Set<RoleResponse> roles;
     String facebookId;
    String googleId;
    String provider;
    LocalDateTime lastLogin;
}
