package com.example.backend.controller;

import com.example.backend.dto.requset.CategoryRequest;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.service.CategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryController {
    CategoryService categoryService;
    // lấy tất cả danh mục
    @GetMapping("/read")
   public APIResponse<List<CategoryResponse>> getAllCategories(){
        var authenticated = SecurityContextHolder.getContext().getAuthentication();
        log.info("Username: {}", authenticated.getName());

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authorities: " + auth.getAuthorities());


        List<CategoryResponse> responses = categoryService.getAllCategories();
       return APIResponse.success(responses);

   }
   // Hàm tạo danh mục
   @PostMapping("/create")
   public APIResponse<Void> createCategory(@ModelAttribute CategoryRequest request) {
       categoryService.createCategory(request);

       return APIResponse.<Void>builder()
               .code(200)
               .messages("Tạo danh mục thành công!")
               .build();
   }
   // Hàm sửa danh mục
    @PutMapping("/update/{categoryId}")
    public APIResponse<Void> updateCategory(
            @PathVariable Long categoryId,
            @ModelAttribute CategoryRequest request){

        categoryService.updateCategory(categoryId,request);
        return APIResponse.<Void>builder()
                .code(200)
                .messages("Cập nhập danh mục thành công!")
                .build();
    }

    // Hàm ẩn/hiện danh mục
    @PutMapping("/status/{categoryId}")
    public APIResponse<Void> categoryActiveStatus(
            @PathVariable Long categoryId,
            @RequestBody CategoryRequest request) {

        Boolean isActive = request.getIsActive();
        categoryService.setCategoryActiveStatus(categoryId, isActive);

        String message = isActive ? "Danh mục đã được hiển thị thành công!"
                : "Danh mục đã được ẩn thành công!";

        return APIResponse.<Void>builder()
                .messages(message)
                .build();
    }




}
