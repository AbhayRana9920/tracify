package com.tracify.service;

import com.tracify.dto.request.LostItemRequest;
import com.tracify.dto.response.LostItemResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.entity.*;
import com.tracify.entity.enums.LostItemStatus;
import com.tracify.exception.BadRequestException;
import com.tracify.exception.ResourceNotFoundException;
import com.tracify.repository.CategoryRepository;
import com.tracify.repository.LostItemRepository;
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
public class LostItemService {

    private final LostItemRepository lostItemRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    @Transactional
    public LostItemResponse createLostItem(String username, LostItemRequest request, List<MultipartFile> images) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        LostItem item = LostItem.builder()
                .title(request.getTitle())
                .itemName(request.getItemName())
                .category(category)
                .description(request.getDescription())
                .color(request.getColor())
                .brand(request.getBrand())
                .locationLost(request.getLocationLost())
                .dateLost(request.getDateLost())
                .identificationMarks(request.getIdentificationMarks())
                .rewardAmount(request.getRewardAmount())
                .contactPreference(request.getContactPreference())
                .user(user)
                .build();

        LostItem savedItem = lostItemRepository.save(item);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                String imageUrl = fileStorageService.storeFile(file, "lost-items");
                ItemImage img = ItemImage.builder()
                        .imageUrl(imageUrl)
                        .imageType("LOST_ITEM")
                        .lostItem(savedItem)
                        .build();
                savedItem.getImages().add(img);
            }
            savedItem = lostItemRepository.save(savedItem);
        }

        return mapToResponse(savedItem);
    }

    @Transactional
    public LostItemResponse updateLostItem(Long id, String username, LostItemRequest request) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost Item", "id", id));

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
        item.setLocationLost(request.getLocationLost());
        item.setDateLost(request.getDateLost());
        item.setIdentificationMarks(request.getIdentificationMarks());
        item.setRewardAmount(request.getRewardAmount());
        item.setContactPreference(request.getContactPreference());

        return mapToResponse(lostItemRepository.save(item));
    }

    public LostItemResponse getLostItemById(Long id) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost Item", "id", id));
        return mapToResponse(item);
    }

    public PagedResponse<LostItemResponse> getAllLostItems(int page, int size, String keyword, Long categoryId, String status) {
        LostItemStatus statusEnum = status != null ? LostItemStatus.valueOf(status) : null;
        Page<LostItem> items = lostItemRepository.searchAndFilter(
                keyword, categoryId, statusEnum,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return mapToPagedResponse(items);
    }

    public PagedResponse<LostItemResponse> getMyLostItems(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Page<LostItem> items = lostItemRepository.findByUserId(user.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return mapToPagedResponse(items);
    }

    @Transactional
    public void deleteLostItem(Long id, String username) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost Item", "id", id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
        if (!item.getUser().getUsername().equals(username) && !isAdmin) {
            throw new BadRequestException("You can only delete your own items");
        }

        item.getImages().forEach(img -> fileStorageService.deleteFile(img.getImageUrl()));
        lostItemRepository.delete(item);
    }

    @Transactional
    public LostItemResponse updateStatus(Long id, String status) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost Item", "id", id));
        item.setStatus(LostItemStatus.valueOf(status));
        return mapToResponse(lostItemRepository.save(item));
    }

    @Transactional
    public void reportFound(Long id, String finderUsername, String message) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lost Item", "id", id));
        
        User finder = userRepository.findByUsername(finderUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", finderUsername));

        if (item.getUser().getId().equals(finder.getId())) {
            throw new BadRequestException("You cannot report your own item as found.");
        }

        String contactDetails = String.format("Finder Email: %s\nFinder Phone: %s\nMessage: %s", 
            finder.getEmail() != null ? finder.getEmail() : "Not provided",
            finder.getPhone() != null ? finder.getPhone() : "Not provided",
            message);

        notificationService.createNotification(
                item.getUser().getId(),
                com.tracify.entity.enums.NotificationType.MATCH_FOUND,
                "Someone found your item!",
                finder.getFullName() + " reported finding your item: " + item.getTitle() + "\n\n" + contactDetails,
                "/lost-items/" + item.getId()
        );
        
        // Optionally update status to match found if you have that status
        item.setStatus(LostItemStatus.MATCH_FOUND);
        lostItemRepository.save(item);
    }

    private LostItemResponse mapToResponse(LostItem item) {
        return LostItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .itemName(item.getItemName())
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .description(item.getDescription())
                .color(item.getColor())
                .brand(item.getBrand())
                .locationLost(item.getLocationLost())
                .dateLost(item.getDateLost())
                .identificationMarks(item.getIdentificationMarks())
                .rewardAmount(item.getRewardAmount())
                .contactPreference(item.getContactPreference())
                .status(item.getStatus().name())
                .userId(item.getUser().getId())
                .userName(item.getUser().getFullName())
                .userProfilePhoto(item.getUser().getProfilePhoto())
                .imageUrls(item.getImages().stream().map(ItemImage::getImageUrl).collect(Collectors.toList()))
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }

    private PagedResponse<LostItemResponse> mapToPagedResponse(Page<LostItem> page) {
        return PagedResponse.<LostItemResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
