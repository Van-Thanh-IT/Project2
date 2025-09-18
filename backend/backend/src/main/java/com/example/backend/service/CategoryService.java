package com.example.backend.service;

import com.example.backend.dto.requset.CategoryRequest;
import com.example.backend.dto.response.CategoryResponse;
import com.example.backend.entity.Category;
import com.example.backend.mapper.CategoryMapper;
import com.example.backend.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class CategoryService {
    CategoryRepository categoryRepository;

    CategoryMapper categoryMapper;

    // lấy tất cả danh mục
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "sortOrder"));
        return categories.stream().map(categoryMapper::toCategoryResponseWithChildren).toList();

    }
    // 🔹 Sinh slug từ tên
     String generateSlug(String name) {
        // Chuyển tiếng Việt có dấu thành không dấu
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{M}", "") // loại bỏ dấu
                .replaceAll("([a-z])([A-Z])", "$1-$2") // chèn '-' trước chữ hoa
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // loại bỏ ký tự đặc biệt
                .replaceAll("\\s+", "-"); // thay khoảng trắng bằng '-'
        return slug;
    }
    //Tạo danh mục
    @Transactional
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }

        String slug = generateSlug(request.getCategoryName());
        if (categoryRepository.existsBySlug(slug)) {
            throw new RuntimeException("Tên slug đã tồn tại!");
        }

        Category category = categoryMapper.toCategory(request);
        category.setSlug(slug);
        Integer maxSortOrder = categoryRepository.findMaxSortOrder();
        category.setSortOrder((maxSortOrder != null ? maxSortOrder : 0) + 1);

        // Gán cha nếu có
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Danh mục cha không tồn tại"));
            category.setParent(parent); // nếu ManyToOne
        }

        return categoryRepository.save(category);
    }

    // hàm cập nhập danh mục
    @Transactional
    public Category updateCategory(Long id, CategoryRequest request) {
        // Lấy category hiện tại
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        // Kiểm tra tên mới có trùng với category khác không
        if (!category.getCategoryName().equals(request.getCategoryName()) &&
                categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }

        // Sinh slug mới từ tên mới
        String slug = generateSlug(request.getCategoryName());
        if (!category.getSlug().equals(slug) &&
                categoryRepository.existsBySlug(slug)) {
            throw new RuntimeException("Slug đã tồn tại!");
        }

        // Cập nhật thông tin
        category.setCategoryName(request.getCategoryName());
        category.setSlug(slug);
        category.setSortOrder(request.getSortOrder());

        // Cập nhật cha nếu có
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Danh mục cha không tồn tại"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        return categoryRepository.save(category);
    }

    // Ẩn / hiện danh mục
    @Transactional
    public void setCategoryActiveStatus(Long id, Boolean isActive) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));

        if (!category.getChildren().isEmpty() && !isActive) {
            throw new RuntimeException("Danh mục có danh mục con, không thể ẩn");
        }

        category.setIsActive(isActive);
    }


}
