package com.tracify.service;

import com.tracify.dto.response.MatchSuggestionResponse;
import com.tracify.entity.FoundItem;
import com.tracify.entity.LostItem;
import com.tracify.entity.enums.FoundItemStatus;
import com.tracify.repository.FoundItemRepository;
import com.tracify.repository.LostItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;

    public List<MatchSuggestionResponse> findMatchesForLostItem(Long lostItemId) {
        LostItem lostItem = lostItemRepository.findById(lostItemId)
                .orElseThrow(() -> new RuntimeException("Lost item not found"));

        List<FoundItem> availableItems;
        if (lostItem.getCategory() != null) {
            availableItems = foundItemRepository
                    .findByStatusAndCategory_Id(FoundItemStatus.AVAILABLE, lostItem.getCategory().getId());
        } else {
            availableItems = foundItemRepository
                    .findByStatus(FoundItemStatus.AVAILABLE, Pageable.unpaged()).getContent();
        }

        return availableItems.stream()
                .map(found -> calculateMatch(lostItem, found))
                .filter(match -> match.getMatchScore() > 0.2)
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .limit(10)
                .collect(Collectors.toList());
    }

    private MatchSuggestionResponse calculateMatch(LostItem lost, FoundItem found) {
        double score = 0;
        List<String> reasons = new ArrayList<>();

        if (lost.getCategory() != null && found.getCategory() != null
                && lost.getCategory().getId().equals(found.getCategory().getId())) {
            score += 0.3;
            reasons.add("Same category");
        }
        if (lost.getColor() != null && found.getColor() != null
                && lost.getColor().equalsIgnoreCase(found.getColor())) {
            score += 0.2;
            reasons.add("Matching color");
        }
        if (lost.getBrand() != null && found.getBrand() != null
                && lost.getBrand().equalsIgnoreCase(found.getBrand())) {
            score += 0.2;
            reasons.add("Same brand");
        }
        if (lost.getItemName() != null && found.getItemName() != null) {
            double sim = calcSimilarity(lost.getItemName(), found.getItemName());
            if (sim > 0.5) { score += 0.15 * sim; reasons.add("Similar name"); }
        }
        if (lost.getDateLost() != null && found.getDateFound() != null) {
            long days = Math.abs(lost.getDateLost().toEpochDay() - found.getDateFound().toEpochDay());
            if (days <= 7) { score += 0.05; reasons.add("Found within a week"); }
        }

        return MatchSuggestionResponse.builder()
                .foundItemId(found.getId()).foundItemTitle(found.getTitle())
                .foundItemName(found.getItemName()).foundItemLocation(found.getLocationFound())
                .foundItemCategory(found.getCategory() != null ? found.getCategory().getName() : null)
                .foundItemColor(found.getColor())
                .matchScore(Math.min(score, 1.0)).matchReason(String.join(", ", reasons))
                .build();
    }

    private double calcSimilarity(String s1, String s2) {
        String[] w1 = s1.toLowerCase().split("\\s+");
        String[] w2 = s2.toLowerCase().split("\\s+");
        int common = 0;
        for (String a : w1) for (String b : w2) if (a.equals(b) && a.length() > 2) { common++; break; }
        return Math.max(w1.length, w2.length) > 0 ? (double) common / Math.max(w1.length, w2.length) : 0;
    }
}
