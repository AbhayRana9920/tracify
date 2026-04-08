package com.tracify.repository;

import com.tracify.entity.ClaimRequest;
import com.tracify.entity.enums.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRequestRepository extends JpaRepository<ClaimRequest, Long> {
    Page<ClaimRequest> findByClaimantId(Long claimantId, Pageable pageable);
    Page<ClaimRequest> findByFoundItemId(Long foundItemId, Pageable pageable);
    Page<ClaimRequest> findByStatus(ClaimStatus status, Pageable pageable);
    List<ClaimRequest> findByFoundItemIdAndClaimantId(Long foundItemId, Long claimantId);
    List<ClaimRequest> findByFoundItemId(Long foundItemId);
    long countByStatus(ClaimStatus status);
    boolean existsByFoundItemIdAndClaimantId(Long foundItemId, Long claimantId);
    boolean existsByFoundItemIdAndStatusIn(Long foundItemId, java.util.List<ClaimStatus> statuses);
}
