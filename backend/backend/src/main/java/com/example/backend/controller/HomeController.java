package com.example.backend.controller;

import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.OrderResponse;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.OrderService;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/home/")
public class HomeController {
    ProductService productService;
    UserService userService;
    OrderService orderService;
    @GetMapping("/products/read")
    public APIResponse<List<ProductResponse>> getAllProductTrue(){
       List<ProductResponse> responses = productService.getHomeAllProducts();
       return APIResponse.success(responses);
    }

    @GetMapping("/info")
    public APIResponse<UserResponse> getInfo(){
        return APIResponse.success(userService.getInfo());
    }

}
