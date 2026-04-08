package com.tracify.service;

import com.tracify.dto.request.ClaimRequestDto;
import com.tracify.dto.response.ClaimResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.entity.ClaimRequest;
import com.tracify.entity.FoundItem;
import com.tracify.entity.User;
import com.tracify.entity.enums.ClaimStatus;
import com.tracify.entity.enums.FoundItemStatus;
import com.tracify.entity.enums.NotificationType;
import com.tracify.exception.BadRequestException;
import com.tracify.exception.ResourceNotFoundException;
import com.tracify.repository.ClaimRequestRepository;
import com.tracify.repository.FoundItemRepository;
import com.tracify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRequestRepository claimRequestRepository;
    private final FoundItemRepository foundItemRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        try {
            jdbcTemplate.execute("ALTER TABLE claim_requests MODIFY COLUMN status VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE found_items MODIFY COLUMN status VARCHAR(50)");
            System.out.println("✅ SUCCESSFULLY ALTERED STATUS COLUMNS IN DB TO VARCHAR(50)");
        } catch (Exception e) {
            System.out.println("⚠️ DB ALTER ERROR (SAFE TO IGNORE IF ALREADY UPDATED): " + e.getMessage());
        }
    }

    @Transactional
    public ClaimResponse submitClaim(String username, ClaimRequestDto request, MultipartFile proofDocument) {
        User claimant = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        FoundItem foundItem = foundItemRepository.findById(request.getFoundItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Found Item", "id", request.getFoundItemId()));

        if (foundItem.getUser().getId().equals(claimant.getId())) {
            throw new BadRequestException("You cannot claim your own item");
        }

        if (claimRequestRepository.existsByFoundItemIdAndClaimantId(foundItem.getId(), claimant.getId())) {
            throw new BadRequestException("You already submitted a claim for this item");
        }

        String proofUrl = null;
        if (proofDocument != null && !proofDocument.isEmpty()) {
            proofUrl = fileStorageService.storeFile(proofDocument, "proofs");
        }

        ClaimRequest claim = ClaimRequest.builder()
                .foundItem(foundItem)
                .claimant(claimant)
                .claimMessage(request.getClaimMessage())
                .proofOfOwnership(request.getProofOfOwnership())
                .identifyingInfo(request.getIdentifyingInfo())
                .proofDocumentUrl(proofUrl)
                .finderEmail(foundItem.getUser().getEmail())
                .finderName(foundItem.getUser().getFullName())
                .finderPhone(foundItem.getUser().getPhone())
                .build();

        ClaimRequest saved = claimRequestRepository.save(claim);

        // Update found item status
        foundItem.setStatus(FoundItemStatus.CLAIM_REQUESTED);
        foundItemRepository.save(foundItem);

        // Notify the finder
        notificationService.createNotification(
                foundItem.getUser().getId(),
                NotificationType.CLAIM_SUBMITTED,
                "New Claim Request",
                claimant.getFullName() + " has submitted a claim for your item: " + foundItem.getTitle(),
                "/claims/" + saved.getId()
        );

        return mapToResponse(saved);
    }

    public ClaimResponse getClaimById(Long id) {
        ClaimRequest claim = claimRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        return mapToResponse(claim);
    }

    public PagedResponse<ClaimResponse> getMyClaims(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Page<ClaimRequest> claims = claimRequestRepository.findByClaimantId(user.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return mapToPagedResponse(claims);
    }

    public PagedResponse<ClaimResponse> getClaimsForItem(Long foundItemId, int page, int size) {
        Page<ClaimRequest> claims = claimRequestRepository.findByFoundItemId(foundItemId,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return mapToPagedResponse(claims);
    }

    public PagedResponse<ClaimResponse> getAllClaims(int page, int size, String status) {
        Page<ClaimRequest> claims;
        if (status != null) {
            claims = claimRequestRepository.findByStatus(ClaimStatus.valueOf(status),
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        } else {
            claims = claimRequestRepository.findAll(
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        }
        return mapToPagedResponse(claims);
    }

    @Transactional
    public ClaimResponse approveClaim(Long id, String adminNotes) {
        ClaimRequest claim = claimRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        if (claim.getStatus() != ClaimStatus.PENDING && claim.getStatus() != ClaimStatus.UNDER_REVIEW) {
            throw new BadRequestException("Claim cannot be approved from its current status.");
        }

        if (claim.getFoundItem().getStatus() == FoundItemStatus.RETURNED || claim.getFoundItem().getStatus() == FoundItemStatus.CLOSED) {
            throw new BadRequestException("This found item is already returned or closed.");
        }

        if (claimRequestRepository.existsByFoundItemIdAndStatusIn(claim.getFoundItem().getId(), 
                java.util.List.of(ClaimStatus.APPROVED, ClaimStatus.HANDOVER_PENDING, ClaimStatus.FINDER_CONFIRMED, ClaimStatus.OWNER_CONFIRMED, ClaimStatus.RETURNED))) {
            throw new BadRequestException("Another claim is already approved for this item.");
        }

        if (adminNotes != null) claim.setAdminNotes(adminNotes);

        claim.setStatus(ClaimStatus.HANDOVER_PENDING); 
        claim.getFoundItem().setStatus(FoundItemStatus.APPROVED_FOR_RETURN);
        foundItemRepository.save(claim.getFoundItem());

        notificationService.createNotification(
                claim.getClaimant().getId(), NotificationType.CLAIM_APPROVED,
                "Claim Approved", "Your claim for '" + claim.getFoundItem().getTitle() + "' has been approved. Please coordinate the handover.",
                "/claims/" + claim.getId());

        // Reject other pending claims automatically
        java.util.List<ClaimRequest> otherClaims = claimRequestRepository.findByFoundItemId(claim.getFoundItem().getId());
        for (ClaimRequest other : otherClaims) {
            if (!other.getId().equals(claim.getId()) && (other.getStatus() == ClaimStatus.PENDING || other.getStatus() == ClaimStatus.UNDER_REVIEW)) {
                other.setStatus(ClaimStatus.REJECTED);
                other.setAdminNotes("Automatically rejected because another claim was approved for this item.");
                claimRequestRepository.save(other);
                notificationService.createNotification(
                        other.getClaimant().getId(), NotificationType.CLAIM_REJECTED,
                        "Claim Rejected", "Your claim for '" + claim.getFoundItem().getTitle() + "' was rejected as the item represents a match with another user.",
                        "/claims/" + other.getId());
            }
        }

        return mapToResponse(claimRequestRepository.save(claim));
    }

    @Transactional
    public ClaimResponse rejectClaim(Long id, String adminNotes) {
        ClaimRequest claim = claimRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
                
        if (claim.getStatus() != ClaimStatus.PENDING && claim.getStatus() != ClaimStatus.UNDER_REVIEW) {
            throw new BadRequestException("Claim cannot be rejected from its current status.");
        }

        claim.setStatus(ClaimStatus.REJECTED);
        if (adminNotes != null) claim.setAdminNotes(adminNotes);

        notificationService.createNotification(
                claim.getClaimant().getId(), NotificationType.CLAIM_REJECTED,
                "Claim Rejected", "Your claim for '" + claim.getFoundItem().getTitle() + "' has been rejected.",
                "/claims/" + claim.getId());

        return mapToResponse(claimRequestRepository.save(claim));
    }

    @Transactional
    public ClaimResponse markClaimUnderReview(Long id, String adminNotes) {
        ClaimRequest claim = claimRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
                
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("Only PENDING claims can be moved to UNDER REVIEW.");
        }

        claim.setStatus(ClaimStatus.UNDER_REVIEW);
        if (adminNotes != null) claim.setAdminNotes(adminNotes);
        
        return mapToResponse(claimRequestRepository.save(claim));
    }

    @Transactional
    public ClaimResponse updateClaimStatus(Long id, String status, String adminNotes) {
        ClaimRequest claim = claimRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        ClaimStatus newStatus = ClaimStatus.valueOf(status);
        
        if (newStatus != ClaimStatus.RETURNED && newStatus != ClaimStatus.CLOSED) {
             throw new BadRequestException("Use explicit review endpoints for this transition.");
        }
        
        claim.setStatus(newStatus);
        if (adminNotes != null) claim.setAdminNotes(adminNotes);

        if (newStatus == ClaimStatus.RETURNED) {
            claim.setReturnedAt(LocalDateTime.now());
            claim.getFoundItem().setStatus(FoundItemStatus.RETURNED);
            foundItemRepository.save(claim.getFoundItem());
            notificationService.createNotification(
                    claim.getClaimant().getId(), NotificationType.ITEM_RETURNED,
                    "Item Returned", "The item '" + claim.getFoundItem().getTitle() + "' has been officially marked as returned by admin.",
                    "/claims/" + claim.getId());
        } else if (newStatus == ClaimStatus.CLOSED) {
            claim.getFoundItem().setStatus(FoundItemStatus.CLOSED);
            foundItemRepository.save(claim.getFoundItem());
        }

        return mapToResponse(claimRequestRepository.save(claim));
    }

    @Transactional
    public ClaimResponse finderConfirmHandover(Long id, String username) {
        ClaimRequest claim = claimRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        if (!claim.getFoundItem().getUser().getUsername().equals(username)) {
            throw new BadRequestException("Only the finder can confirm handover.");
        }
        claim.setFinderConfirmedHandover(true);
        if (Boolean.TRUE.equals(claim.getOwnerConfirmedReceipt())) {
            claim.setStatus(ClaimStatus.FINDER_CONFIRMED); // Both confirmed essentially
        } else {
            claim.setStatus(ClaimStatus.FINDER_CONFIRMED);
        }
        
        notificationService.createNotification(
                claim.getClaimant().getId(), NotificationType.ITEM_RETURNED, // Adapt
                "Handover Confirmed by Finder", "The finder has confirmed the handover.",
                "/claims/" + claim.getId());

        return mapToResponse(claimRequestRepository.save(claim));
    }

    @Transactional
    public ClaimResponse ownerConfirmReceipt(Long id, String username) {
        ClaimRequest claim = claimRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        if (!claim.getClaimant().getUsername().equals(username)) {
            throw new BadRequestException("Only the owner can confirm receipt.");
        }
        claim.setOwnerConfirmedReceipt(true);
        if (Boolean.TRUE.equals(claim.getFinderConfirmedHandover())) {
            claim.setStatus(ClaimStatus.OWNER_CONFIRMED); // Both confirmed essentially
        } else {
            claim.setStatus(ClaimStatus.OWNER_CONFIRMED);
        }
        
        notificationService.createNotification(
                claim.getFoundItem().getUser().getId(), NotificationType.ITEM_RETURNED,
                "Item Receipt Confirmed by Owner", "The owner has confirmed receiving the item.",
                "/found-items/" + claim.getFoundItem().getId());

        return mapToResponse(claimRequestRepository.save(claim));
    }

    private ClaimResponse mapToResponse(ClaimRequest claim) {
        boolean canShareContact = claim.getStatus() == ClaimStatus.APPROVED || 
                                  claim.getStatus() == ClaimStatus.HANDOVER_PENDING || 
                                  claim.getStatus() == ClaimStatus.FINDER_CONFIRMED || 
                                  claim.getStatus() == ClaimStatus.OWNER_CONFIRMED || 
                                  claim.getStatus() == ClaimStatus.RETURNED || 
                                  claim.getStatus() == ClaimStatus.CLOSED;
                                  
        return ClaimResponse.builder()
                .id(claim.getId())
                .foundItemId(claim.getFoundItem().getId())
                .foundItemTitle(claim.getFoundItem().getTitle())
                .claimantId(claim.getClaimant().getId())
                .claimantName(claim.getClaimant().getFullName())
                .claimantProfilePhoto(claim.getClaimant().getProfilePhoto())
                .claimantEmail(canShareContact ? claim.getClaimant().getEmail() : null)
                .claimantPhone(canShareContact ? claim.getClaimant().getPhone() : null)
                .finderEmail(canShareContact ? claim.getFoundItem().getUser().getEmail() : null)
                .finderPhone(canShareContact ? claim.getFoundItem().getUser().getPhone() : null)
                .claimMessage(claim.getClaimMessage())
                .proofOfOwnership(claim.getProofOfOwnership())
                .identifyingInfo(claim.getIdentifyingInfo())
                .proofDocumentUrl(claim.getProofDocumentUrl())
                .status(claim.getStatus().name())
                .adminNotes(claim.getAdminNotes())
                .verifiedAt(claim.getVerifiedAt())
                .returnedAt(claim.getReturnedAt())
                .finderConfirmedHandover(Boolean.TRUE.equals(claim.getFinderConfirmedHandover()))
                .ownerConfirmedReceipt(Boolean.TRUE.equals(claim.getOwnerConfirmedReceipt()))
                .createdAt(claim.getCreatedAt())
                .updatedAt(claim.getUpdatedAt())
                .build();
    }

    private PagedResponse<ClaimResponse> mapToPagedResponse(Page<ClaimRequest> page) {
        return PagedResponse.<ClaimResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
