package com.tracify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private Long claimId;
    private Long senderId;
    private String senderName;
    private String senderProfilePhoto;
    private String content;
    private boolean isRead;
    private LocalDateTime createdAt;
}
