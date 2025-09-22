package com.example.backend.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class User {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     @Column(name = "user_id")
     Integer userId;

     @Column(name = "full_name", nullable = false)
     String fullName;

     @Column(name = "email", nullable = false, unique = true)
     String email;

     @Column(name = "password_hash", nullable = false)
     String password;

     @Column(name = "phone")
     String phone;

     @Column(name = "is_active")
     Boolean isActive;

     @Column(name = "created_at", insertable = false, updatable = false)
     LocalDateTime createdAt;

     @ManyToMany(fetch = FetchType.LAZY)
     @JoinTable(
             name = "user_roles",
             joinColumns = @JoinColumn(name = "user_id"),
             inverseJoinColumns = @JoinColumn(name = "role_id")
     )
     Set<Role> roles = new HashSet<>();

}
