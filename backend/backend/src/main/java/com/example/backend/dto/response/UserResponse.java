package com.example.backend.dto.response;

import com.example.backend.entity.Role;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
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
     Set<RoleResponse> roles;

}
