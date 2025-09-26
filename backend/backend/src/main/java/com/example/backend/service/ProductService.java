package com.example.backend.service;

import com.example.backend.dto.requset.ProductImageRequest;
import com.example.backend.dto.requset.ProductVariantRequest;
import com.example.backend.dto.response.ProductImageResponse;
import com.example.backend.dto.response.ProductVariantResponse;
import com.example.backend.entity.ProductImage;
import com.example.backend.entity.ProductVariant;
import com.example.backend.repository.ProductImageRepository;
import com.example.backend.repository.ProductVariantRepository;
import com.example.backend.util.FileUploadUtil;
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
    ProductImageRepository productImageRepository;
    ProductVariantRepository productVariantRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;
    SlugUtil slugUtil;
    FileUploadUtil fileUploadUtil;

    // get home product
    public List<ProductResponse> getHomeAllProducts() {
        return productRepository.findByIsActiveTrue()
                .stream()
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

    // update product
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
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với productId: " + productId));

        product.setIsActive(request.getIsActive());
        productRepository.save(product);
    }

    //////////////////////////////// dùng cho ProductImage

    // getAllProductImages
    public List<ProductImageResponse> getImagesByProductId(Long productId){
        List<ProductImage> productImages = productImageRepository.findByProduct_ProductId(productId);
        return productImages.stream()
                .map(productMapper::toProductImageResponse).toList();
    }


    //create productImage
    @Transactional
    public ProductImage createProductImage(Long productId,ProductImageRequest request){
       Product product = productRepository.findById(productId)
               .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có productId: " + productId));

       //upload ảnh
        String imageUrl = fileUploadUtil.saveFile(request.getImage());

        ProductImage productImage = productMapper.toProductImage(request);
        productImage.setImageUrl(imageUrl);
        productImage.setProduct(product);
        productImage.setIsPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false);

        return productImageRepository.save(productImage);

    }

    @Transactional
    public ProductImage updateProductImage(Long imageId,ProductImageRequest request ){
        ProductImage existingImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy imageId này: "+ imageId));


        // Xóa file cũ
        fileUploadUtil.deleteFile(existingImage.getImageUrl());
        String imageUrl = fileUploadUtil.saveFile(request.getImage());

        // upload ảnh
        existingImage.setImageUrl(imageUrl);
        existingImage.setIsPrimary(request.getIsPrimary());

        return productImageRepository.save(existingImage);

    }

    @Transactional
    public void deleteImage(Long imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh với id: " + imageId));

        productImageRepository.delete(image);
    }

    ///////////////////////////////// ProductVariant

    // lấy dữ liệu theo productId;
    public List<ProductVariantResponse> getVariantByProductId(Long productId){
        List<ProductVariant> productImages = productVariantRepository.findByProduct_ProductId(productId);
        return productImages.stream()
                .map(productMapper::toProductVariantResponse).toList();
    }

    // Tạo variant cho product
    @Transactional
    public ProductVariant createProductVariant(Long productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có productId: " + productId));

        ProductVariant variant = productMapper.toProductVariant(request);
        variant.setProduct(product);
        variant.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        return productVariantRepository.save(variant);
    }

    // Cập nhật variant
    @Transactional
    public ProductVariant updateProductVariant(Long variantId, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy variantId: " + variantId));

        variant.setColor(request.getColor());
        variant.setSize(request.getSize());
        variant.setPrice(request.getPrice());
        variant.setWeight(request.getWeight());
        variant.setIsActive(request.getIsActive());

        return productVariantRepository.save(variant);
    }

    // Xóa variant
    @Transactional
    public void deleteProductVariant(Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy variantId: " + variantId));

        productVariantRepository.delete(variant);
    }







}
