package com.tracify.service;

import com.tracify.dto.request.FoundItemRequest;
import com.tracify.dto.response.FoundItemResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.entity.*;
import com.tracify.entity.enums.FoundItemStatus;
import com.tracify.exception.BadRequestException;
import com.tracify.exception.ResourceNotFoundException;
import com.tracify.repository.CategoryRepository;
import com.tracify.repository.FoundItemRepository;
import com.tracify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoundItemService {

    private final FoundItemRepository foundItemRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public FoundItemResponse createFoundItem(String username, FoundItemRequest request, List<MultipartFile> images) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        FoundItem item = FoundItem.builder()
                .title(request.getTitle())
                .itemName(request.getItemName())
                .category(category)
                .description(request.getDescription())
                .color(request.getColor())
                .brand(request.getBrand())
                .locationFound(request.getLocationFound())
                .dateFound(request.getDateFound())
                .identificationMarks(request.getIdentificationMarks())
                .storageLocation(request.getStorageLocation())
                .user(user)
                .build();

        FoundItem savedItem = foundItemRepository.save(item);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                String imageUrl = fileStorageService.storeFile(file, "found-items");
                ItemImage img = ItemImage.builder()
                        .imageUrl(imageUrl)
                        .imageType("FOUND_ITEM")
                        .foundItem(savedItem)
                        .build();
                savedItem.getImages().add(img);
            }
            savedItem = foundItemRepository.save(savedItem);
        }

        return mapToResponse(savedItem);
    }

    @Transactional
    public FoundItemResponse updateFoundItem(Long id, String username, FoundItemRequest request) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Found Item", "id", id));

        if (!item.getUser().getUsername().equals(username)) {
            throw new BadRequestException("You can only edit your own items");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        item.setTitle(request.getTitle());
        item.setItemName(request.getItemName());
        item.setCategory(category);
        item.setDescription(request.getDescription());
        item.setColor(request.getColor());
        item.setBrand(request.getBrand());
        item.setLocationFound(request.getLocationFound());
        item.setDateFound(request.getDateFound());
        item.setIdentificationMarks(request.getIdentificationMarks());
        item.setStorageLocation(request.getStorageLocation());

        return mapToResponse(foundItemRepository.save(item));
    }

    public FoundItemResponse getFoundItemById(Long id) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Found Item", "id", id));
        return mapToResponse(item);
    }

    public PagedResponse<FoundItemResponse> getAllFoundItems(int page, int size, String keyword, Long categoryId,
            String status) {
        FoundItemStatus statusEnum = status != null ? FoundItemStatus.valueOf(status) : null;
        Page<FoundItem> items = foundItemRepository.searchAndFilter(
                keyword, categoryId, statusEnum,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return mapToPagedResponse(items);
    }

    public PagedResponse<FoundItemResponse> getMyFoundItems(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Page<FoundItem> items = foundItemRepository.findByUserId(user.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return mapToPagedResponse(items);
    }

    @Transactional
    public void deleteFoundItem(Long id, String username) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Found Item", "id", id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
        if (!item.getUser().getUsername().equals(username) && !isAdmin) {
            throw new BadRequestException("You can only delete your own items");
        }

        item.getImages().forEach(img -> fileStorageService.deleteFile(img.getImageUrl()));
        foundItemRepository.delete(item);
    }

    @Transactional
    public FoundItemResponse updateStatus(Long id, String status) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Found Item", "id", id));
        item.setStatus(FoundItemStatus.valueOf(status));
        return mapToResponse(foundItemRepository.save(item));
    }

    private FoundItemResponse mapToResponse(FoundItem item) {
        return FoundItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .itemName(item.getItemName())
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .description(item.getDescription())
                .color(item.getColor())
                .brand(item.getBrand())
                .locationFound(item.getLocationFound())
                .dateFound(item.getDateFound())
                .identificationMarks(item.getIdentificationMarks())
                .storageLocation(item.getStorageLocation())
                .status(item.getStatus().name())
                .userId(item.getUser().getId())
                .userName(item.getUser().getFullName())
                .userProfilePhoto(item.getUser().getProfilePhoto())
                .imageUrls(item.getImages().stream().map(ItemImage::getImageUrl).collect(Collectors.toList()))
                .claimCount(item.getClaimRequests() != null ? item.getClaimRequests().size() : 0)
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private PagedResponse<FoundItemResponse> mapToPagedResponse(Page<FoundItem> page) {
        return PagedResponse.<FoundItemResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
