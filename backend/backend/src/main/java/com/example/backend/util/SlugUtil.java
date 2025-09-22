package com.example.backend.util;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
@Component
public class SlugUtil {
    public String generateSlug(String name) {
        // Chuyển tiếng Việt có dấu thành không dấu
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String slug = normalized.replaceAll("\\p{M}", "") // loại bỏ dấu
                .replaceAll("([a-z])([A-Z])", "$1-$2") // chèn '-' trước chữ hoa
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // loại bỏ ký tự đặc biệt
                .replaceAll("\\s+", "-"); // thay khoảng trắng bằng '-'
        return slug;
    }
}
