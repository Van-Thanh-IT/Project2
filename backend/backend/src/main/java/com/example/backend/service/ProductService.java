package com.example.backend.service;

import com.example.backend.util.SlugUtil;
import com.example.backend.dto.requset.ProductRequest;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.entity.Category;
import com.example.backend.entity.Product;
import com.example.backend.mapper.ProductMapper;
import com.example.backend.repository.CategoryRepository;
import com.example.backend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Service
public class ProductService {
    ProductRepository productRepository;
    ProductMapper productMapper;

    CategoryRepository categoryRepository;

    SlugUtil slugUtil;

    // get home product
    public List<ProductResponse> getHomeAllProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    //search all product by categoryname
    public List<ProductResponse> searchProductsByCategoryName(String categoryName) {
        List<Product> products = productRepository
                .findByCategory_CategoryNameContainingIgnoreCaseAndCategory_IsActiveTrueAndIsActiveTrue(categoryName);
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }


    // get products
    public List<ProductResponse> getAllProducts(){
      List<Product> products = productRepository.findAll();
      return products.stream().map(productMapper::toProductResponse).toList();
    }

    // create product
    @Transactional
    public Product createProduct(ProductRequest request){
        //check category_id
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy category_id"));


        String slug = slugUtil.generateSlug(request.getProductName());
        if(productRepository.existsBySlug(slug)){
            throw new RuntimeException("slug sản phẩm này đã tồn tại");
        }

        Product product = productMapper.toProduct(request);
        product.setSlug(slug);
        product.setCategory(category);

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long productId, ProductRequest request) {
        // 1. find product_id
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + productId));

        // 2. check category_id
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy category_id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        // check slug sửa có trùng tên ko
        if (!product.getProductName().equals(request.getProductName())) {
            String newSlug = slugUtil.generateSlug(request.getProductName());
            if (productRepository.existsBySlug(newSlug) && !newSlug.equals(product.getSlug())) {
                throw new RuntimeException("Slug sản phẩm này đã tồn tại");
            }
            product.setSlug(newSlug);
        }

        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setMaterial(request.getMaterial());
        product.setBrand(request.getBrand());
        product.setIsActive(request.getIsActive());

        return productRepository.save(product);
    }

    // Soft delete
    @Transactional
    public void deleteProduct(Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + productId));

        product.setIsActive(request.getIsActive());
        productRepository.save(product);
    }



}
