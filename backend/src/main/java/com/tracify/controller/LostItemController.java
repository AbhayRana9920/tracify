package com.tracify.controller;

import com.tracify.dto.request.LostItemRequest;
import com.tracify.dto.response.ApiResponse;
import com.tracify.dto.response.LostItemResponse;
import com.tracify.dto.response.MatchSuggestionResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.service.LostItemService;
import com.tracify.service.MatchingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/lost-items")
@RequiredArgsConstructor
public class LostItemController {

    private final LostItemService lostItemService;
    private final MatchingService matchingService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<LostItemResponse>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestPart("item") LostItemRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lost item posted",
                        lostItemService.createLostItem(userDetails.getUsername(), request, images)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LostItemResponse>> update(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LostItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lost item updated",
                lostItemService.updateLostItem(id, userDetails.getUsername(), request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LostItemResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Lost item found", lostItemService.getLostItemById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<LostItemResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success("Lost items",
                lostItemService.getAllLostItems(page, size, keyword, categoryId, status)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<LostItemResponse>>> getMyItems(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.success("My lost items",
                lostItemService.getMyLostItems(userDetails.getUsername(), page, size)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        lostItemService.deleteLostItem(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lost item deleted"));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<ApiResponse<List<MatchSuggestionResponse>>> getMatches(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Match suggestions",
                matchingService.findMatchesForLostItem(id)));
    }

    @PostMapping("/{id}/report-found")
    public ResponseEntity<ApiResponse<Void>> reportFound(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody java.util.Map<String, String> payload) {
        lostItemService.reportFound(id, userDetails.getUsername(), payload.get("message"));
        return ResponseEntity.ok(ApiResponse.success("Report submitted successfully"));
    }
}
