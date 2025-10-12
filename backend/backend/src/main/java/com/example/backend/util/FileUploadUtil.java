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

//    // Đường dẫn tĩnh
//    private static final String UPLOAD_DIR = "D:/Project2/backend/uploads/";
//    private static final String UPLOAD_URL = "/uploads/";
//
//    // Lưu file
//    public String saveFile(MultipartFile file) {
//        if (file == null || file.isEmpty()) return null;
//
//        try {
//            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//            File dir = new File(UPLOAD_DIR);
//            if (!dir.exists()) dir.mkdirs();
//
//            Path path = Paths.get(UPLOAD_DIR + fileName);
//            Files.write(path, file.getBytes());
//
//            return UPLOAD_URL + fileName; // URL phục vụ frontend
//        } catch (IOException e) {
//            throw new RuntimeException("Lỗi upload file: " + e.getMessage(), e);
//        }
//    }
//
//    // Xóa file
//    public boolean deleteFile(String imageUrl) {
//        if (imageUrl == null) return false;
//
//        File file = new File(UPLOAD_DIR + imageUrl.replace(UPLOAD_URL, ""));
//        if (file.exists()) return file.delete();
//
//        return false;
//    }
}

