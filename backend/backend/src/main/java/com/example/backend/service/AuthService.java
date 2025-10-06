package com.example.backend.service;

import com.example.backend.dto.requset.ForgotPasswordRequest;
import com.example.backend.dto.requset.UserRequest;
import com.example.backend.util.FacebookProperties;
import com.example.backend.util.JwtProperties;
import com.example.backend.dto.requset.AuthenticationRequest;
import com.example.backend.dto.response.AuthenticationResponse;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.enums.RoleName;
import com.example.backend.exception.CustomException;
import com.example.backend.exception.ErrorCode;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

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
    FacebookProperties facebookProperties;

    // Hàm đăng ký
    public void register(UserRequest request) {

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

        user.setIsActive(true);
        userRepository.save(user);
    }

    //hàm quên mk
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request){
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email chưa được đăng ký!"));

        // 2. Kiểm tra confirm password
        if(!request.getPassword().equals(request.getConfirmPassword())){
            throw new CustomException(ErrorCode.USER_PASSWORD_NOT_MATCH);
        }

        // 3. Encode mật khẩu mới
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encodedPassword);

        // 4. Lưu user
        userRepository.save(user);
    }


    // Hàm đăng nhập
    public AuthenticationResponse login(AuthenticationRequest request){
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng!,"));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated){
            throw new RuntimeException("Email hoặc mật khẩu không đúng!");
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


    // Đăng nhập google
    public AuthenticationResponse loginWithGoogle(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(jwtProperties.getGoogleClientId()))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new CustomException(ErrorCode.INVALID_TOKEN);
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String googleId = payload.getSubject(); // lấy Google User ID

            // Tìm theo email (hoặc googleId)
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFullName(name);
                newUser.setGoogleId(googleId);
                newUser.setProvider("google");

                newUser.setRoles(new HashSet<>(Set.of(
                        roleRepository.findByRoleName(RoleName.USER.name())
                                .orElseThrow(() -> new CustomException(ErrorCode.ROLE_NOT_FOUND))
                )));
                newUser.setIsActive(true);
                return userRepository.save(newUser);
            });

            // Nếu user đã có nhưng chưa cập nhật googleId/provider
            if (user.getGoogleId() == null) {
                user.setGoogleId(googleId);
                user.setProvider("google");
                userRepository.save(user);
            }

            var token = generateToken(user);
            return AuthenticationResponse.builder()
                    .token(token)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Tài khoản chưa được xác thực", e);
        }
    }


    // đăng nhập facebook
    public AuthenticationResponse loginWithFacebook(String userAccessToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // 1. Kiểm tra token hợp lệ với App Secret
            String debugUrl = "https://graph.facebook.com/debug_token" +
                    "?input_token=" + userAccessToken +
                    "&access_token=" + facebookProperties.getAppId() + "|" + facebookProperties.getAppSecret();

            Map<String, Object> debugResult = restTemplate.getForObject(debugUrl, Map.class);
            Map<String, Object> data = (Map<String, Object>) debugResult.get("data");
            if (data == null || !(Boolean) data.get("is_valid")) {
                throw new RuntimeException("Invalid Facebook token");
            }

            // 2. Lấy thông tin user từ Graph API
            String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + userAccessToken;
            Map<String, Object> fbUser = restTemplate.getForObject(url, Map.class);

            String facebookId = (String) fbUser.get("id");
            String name = (String) fbUser.get("name");
            String email = (String) fbUser.get("email");

            // 3. Tìm hoặc tạo user
            User user = userRepository.findByFacebookId(facebookId)
                    .or(() -> email != null ? userRepository.findByEmail(email) : Optional.empty())
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setFacebookId(facebookId);
                        newUser.setFullName(name);
                        newUser.setProvider("facebook");
                        newUser.setIsActive(true);
                        newUser.setEmail(email != null ? email : facebookId + "@facebook.com");
                        newUser.setRoles(Set.of(
                                roleRepository.findByRoleName("USER")
                                        .orElseThrow(() -> new RuntimeException("Role USER not found"))
                        ));
                        return userRepository.save(newUser);
                    });

            // 4. Cập nhật login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // 5. Tạo JWT
            String token = generateToken(user);

            return AuthenticationResponse.builder().token(token).build();

        } catch (Exception e) {
            throw new RuntimeException("Facebook login failed", e);
        }
    }

}
