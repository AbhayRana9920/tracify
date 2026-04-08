package com.tracify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchSuggestionResponse {
    private Long foundItemId;
    private String foundItemTitle;
    private String foundItemName;
    private String foundItemLocation;
    private String foundItemCategory;
    private String foundItemColor;
    private double matchScore;
    private String matchReason;
}
