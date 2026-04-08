package com.tracify.service;

import com.tracify.dto.response.DashboardStatsResponse;
import com.tracify.entity.enums.*;
import com.tracify.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ClaimRequestRepository claimRequestRepository;
    private final ComplaintRepository complaintRepository;

    public DashboardStatsResponse getStats() {
        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalLostItems(lostItemRepository.count())
                .totalFoundItems(foundItemRepository.count())
                .totalClaims(claimRequestRepository.count())
                .openLostItems(lostItemRepository.countByStatus(LostItemStatus.OPEN))
                .availableFoundItems(foundItemRepository.countByStatus(FoundItemStatus.AVAILABLE))
                .pendingClaims(claimRequestRepository.countByStatus(ClaimStatus.PENDING))
                .resolvedItems(foundItemRepository.countByStatus(FoundItemStatus.RETURNED))
                .pendingComplaints(complaintRepository.countByStatus(ComplaintStatus.PENDING))
                .build();
    }
}
