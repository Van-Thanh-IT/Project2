package com.example.backend.service;

import com.example.backend.config.JwtProperties;
import com.example.backend.dto.requset.AuthenticationRequest;
import com.example.backend.dto.requset.RegisterRequest;
import com.example.backend.dto.response.AuthenticationResponse;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.enums.RoleName;
import com.example.backend.exception.CustomException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.StringJoiner;
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class AuthService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;

    //key
    JwtProperties jwtProperties;

    // Hàm đăng ký
    public void register(RegisterRequest request) {

        // Check email đã tồn tại hay chưa
        if(userRepository.existsByEmail(request.getEmail())){
            throw new CustomException(ErrorCode.USER_EMAIL_EXISTED);
        }
        // Check phone đã tồn tại hay chưa
        if(userRepository.existsByPhone(request.getPhone())){
            throw new CustomException(ErrorCode.USER_PHONE_EXISTED);
        }
        // Check lại mật khẩu
        if(!(request.getPassword().equals(request.getConfirmPassword()))){
            throw new CustomException(ErrorCode.USER_PASSWORD_NOT_MATCH);
        }

        String password_hash = passwordEncoder.encode(request.getPassword());

        User user = userMapper.toRegister(request);
        user.setPassword(password_hash);

        Role defaultRole = roleRepository.findByRoleName(RoleName.USER.name()) .orElseGet(() -> {
            Role role = new Role();
            role.setRoleName(RoleName.USER.name());
            return roleRepository.save(role);
        });

        Role roles = new Role();
        roles.setRoleName(RoleName.USER.name());
        user.setRoles(new HashSet<>(
                Set.of(defaultRole)));
        userRepository.save(user);
    }

    // Hàm đăng nhập
    public AuthenticationResponse login(AuthenticationRequest request){
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated){
            throw new RuntimeException("Email hoặc mật khẩu không đúng, vui lòng thử lại!");
        }

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }
    // Hàm tạo token
     public String generateToken(User user){
        //Thuật toán hs512
         JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

         JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                 .subject(user.getEmail())
                 .issuer("teamProject2.com")
                 .expirationTime(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                 .claim("roles", buildScope(user))
                 .build();

         //Tạo một JWSObject (JSON Web Signature Object) = header + payload (chưa ký).
         Payload payload = new Payload(jwtClaimsSet.toJSONObject());
         JWSObject jwsObject = new JWSObject(header, payload);

         try{
             // MACSigner dùng secret (chuỗi SECRET) để ký nội dung bằng HMAC-SHA512.
             jwsObject.sign(new MACSigner(jwtProperties.getSecret().getBytes()));
             // Sau khi ký xong, gọi serialize() để xuất JWT ra string theo chuẩn 3 phần:
             return jwsObject.serialize();
         }
         catch (JOSEException ex){
             throw new RuntimeException(ex);
         }
     }

    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())){
            user.getRoles().forEach(role -> stringJoiner.add(role.getRoleName()));
        }
        return stringJoiner.toString();
    }

}
