package com.example.backend.service;

import com.example.backend.dto.Inter.HomeProductProjection;
import com.example.backend.dto.requset.ProductImageRequest;
import com.example.backend.dto.requset.ProductVariantRequest;
import com.example.backend.dto.response.ProductImageResponse;
import com.example.backend.dto.response.ProductVariantResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.example.backend.util.Cloudinaryutil;
import com.example.backend.util.SlugUtil;
import com.example.backend.dto.requset.ProductRequest;
import com.example.backend.dto.response.ProductResponse;
import com.example.backend.mapper.ProductMapper;
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

    InventoryRepository inventoryRepository;

    ProductMapper productMapper;
    SlugUtil slugUtil;
    Cloudinaryutil cloudinaryutil;

    // tìm kiếm sản phẩm
    public List<HomeProductProjection> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }

    //tìm kiếm sp theo danh mục
    public List<HomeProductProjection> getProductsByCategorySlug(String slug) {
        return productRepository.findProductsByCategorySlug(slug);
    }

    // get home product
    public List<HomeProductProjection> getHomeAllProducts() {
        return productRepository.findAllActiveHomeProductsNative();

    }
    // get home product
    public List<HomeProductProjection> getTopSellingProducts() {
        return productRepository.findTopSellingProductsForHome();
    }
    // get product detal slug
    public ProductResponse getProductDetailBySlug(String slug){
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với slug: " + slug));

        // map sang response (bao gồm images + variants)
        ProductResponse response = productMapper.toProductResponse(product);

        // lấy image
        List<ProductImageResponse> images = getImagesByProductId(product.getProductId().longValue());
        response.setImages(images);

        // lấy variant
        List<ProductVariantResponse> variants = getVariantByProductId(product.getProductId().longValue());
        response.setVariants(variants);

        return response;
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
        product.setIsActive(true);

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
    public ProductImage createProductImage(Long productId, ProductImageRequest request) {
        // Tìm sản phẩm
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có productId: " + productId));

        // Nếu là ảnh chính → kiểm tra có ảnh chính cũ chưa
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            ProductImage existingPrimary = productImageRepository.findByProductIdAndIsPrimaryTrue(productId);
            if (existingPrimary != null) {
                throw new RuntimeException("Ảnh chính đã tồn tại, vui lòng xóa ảnh chính cũ trước khi thêm mới!");
            }
        }

        // Upload ảnh lên Cloudinary
        String imageUrl = cloudinaryutil.saveFile(request.getImage());

        // Tạo entity ProductImage mới
        ProductImage productImage = productMapper.toProductImage(request);
        productImage.setImageUrl(imageUrl);
        productImage.setProduct(product);
        productImage.setIsPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false);

        return productImageRepository.save(productImage);
    }



    @Transactional
    public ProductImage updateProductImage(Long imageId, ProductImageRequest request) {
        ProductImage existingImage = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy imageId này: " + imageId));

        Long productId = existingImage.getProduct().getProductId();

        // Nếu cập nhật thành ảnh chính → kiểm tra xem sản phẩm đã có ảnh chính khác chưa
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            ProductImage existingPrimary = productImageRepository.findByProductIdAndIsPrimaryTrue(productId);
            if (existingPrimary != null && !existingPrimary.getImageId().equals(imageId)) {
                throw new RuntimeException("Ảnh chính đã tồn tại, không thể đặt ảnh này làm ảnh chính!");
            }
        }

        // Xóa ảnh cũ trên Cloudinary
        cloudinaryutil.deleteFile(existingImage.getImageUrl());

        // Upload ảnh mới
        String imageUrl = cloudinaryutil.saveFile(request.getImage());

        // Cập nhật thông tin ảnh
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

    // lấy tất cả dl
    public List<ProductVariantResponse> getAllVariants(){
        List<ProductVariant> productImages = productVariantRepository.findAll();
        return productImages.stream()
                .map(productMapper::toProductVariantResponse).toList();
    }

    // lấy dữ liệu theo productId;
    public List<ProductVariantResponse> getVariantByProductId(Long productId){
        List<ProductVariant> productVariants = productVariantRepository.findByProduct_ProductId(productId);
        return productVariants.stream()
                .map(productMapper::toProductVariantResponse).toList();
    }

    // Tạo variant cho product
    @Transactional
    public ProductVariant createProductVariant(Long productId, ProductVariantRequest request) {
        //Kiểm tra productId có tồn tại hay ko
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có productId: " + productId));

        //Kiểm tra trùng từng thuộc tính
        if (productVariantRepository.existsByProductAndSize(product, request.getSize())) {
            throw new RuntimeException("Kích thước này đã tồn tại cho sản phẩm!");
        }
        if (productVariantRepository.existsByProductAndColor(product, request.getColor())) {
            throw new RuntimeException("Màu này đã tồn tại cho sản phẩm!");
        }
        if (productVariantRepository.existsByProductAndPrice(product, request.getPrice())) {
            throw new RuntimeException("Giá này đã tồn tại cho sản phẩm!");
        }
        if (productVariantRepository.existsByProductAndWeight(product, request.getWeight())) {
            throw new RuntimeException("Cân nặng này đã tồn tại cho sản phẩm!");
        }

        //Tạo biến thể mới
        ProductVariant variant = productMapper.toProductVariant(request);
        variant.setProduct(product);
        variant.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        ProductVariant savedVariant = productVariantRepository.save(variant);

        //Tạo bản ghi tồn kho
        Inventory inventory = new Inventory();
        inventory.setVariant(savedVariant);
        inventory.setQuantity(0);
        inventory.setSafetyStock(10);
        inventoryRepository.save(inventory);

        return savedVariant;
    }


    // Cập nhật variant
    @Transactional
    public ProductVariant updateProductVariant(Long variantId, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy variantId: " + variantId));

        Product product = variant.getProduct();

        // Kiểm tra trùng nhưng loại trừ chính variant đang sửa
        if (productVariantRepository.existsByProductAndSizeAndVariantIdNot(product, request.getSize(), variantId)) {
            throw new RuntimeException("Kích thước này đã tồn tại cho sản phẩm!");
        }
        if (productVariantRepository.existsByProductAndColorAndVariantIdNot(product, request.getColor(), variantId)) {
            throw new RuntimeException("Màu này đã tồn tại cho sản phẩm!");
        }
        if (productVariantRepository.existsByProductAndPriceAndVariantIdNot(product, request.getPrice(), variantId)) {
            throw new RuntimeException("Giá này đã tồn tại cho sản phẩm!");
        }
        if (productVariantRepository.existsByProductAndWeightAndVariantIdNot(product, request.getWeight(), variantId)) {
            throw new RuntimeException("Cân nặng này đã tồn tại cho sản phẩm!");
        }

        variant.setSize(request.getSize());
        variant.setColor(request.getColor());
        variant.setPrice(request.getPrice());
        variant.setWeight(request.getWeight());
        variant.setIsActive(request.getIsActive());

        return productVariantRepository.save(variant);
    }


    // Xóa variant
    @Transactional
    public void deleteProductVariant(Long variantId, Boolean isActive) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể sản phẩm"));
        variant.setIsActive(isActive);
        productVariantRepository.save(variant);
    }







}
