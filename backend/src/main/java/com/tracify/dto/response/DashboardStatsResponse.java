package com.tracify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalLostItems;
    private long totalFoundItems;
    private long totalClaims;
    private long openLostItems;
    private long availableFoundItems;
    private long pendingClaims;
    private long resolvedItems;
    private long pendingComplaints;
}
