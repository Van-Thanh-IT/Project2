package com.example.backend.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class FileUploadUtil {

    private static final String UPLOAD_DIR = "D:/Project2/backend/uploads/"; // thư mục lưu file ngoài backend

    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());

            return "/uploads/" + fileName; // URL phục vụ frontend
        } catch (IOException e) {
            throw new RuntimeException("Lỗi upload file: " + e.getMessage(), e);
        }
    }
}
