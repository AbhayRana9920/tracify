package com.tracify.service;

import com.tracify.dto.request.MessageRequest;
import com.tracify.dto.response.MessageResponse;
import com.tracify.entity.ClaimRequest;
import com.tracify.entity.Message;
import com.tracify.entity.User;
import com.tracify.entity.enums.NotificationType;
import com.tracify.exception.ResourceNotFoundException;
import com.tracify.repository.ClaimRequestRepository;
import com.tracify.repository.MessageRepository;
import com.tracify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ClaimRequestRepository claimRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public MessageResponse sendMessage(String username, MessageRequest request) {
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        ClaimRequest claim = claimRequestRepository.findById(request.getClaimId())
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", request.getClaimId()));

        Message message = Message.builder()
                .claimRequest(claim)
                .sender(sender)
                .content(request.getContent())
                .build();

        Message saved = messageRepository.save(message);

        // Notify the other party
        Long recipientId = claim.getClaimant().getId().equals(sender.getId())
                ? claim.getFoundItem().getUser().getId()
                : claim.getClaimant().getId();

        notificationService.createNotification(
                recipientId,
                NotificationType.NEW_MESSAGE,
                "New Message",
                sender.getFullName() + " sent you a message about claim #" + claim.getId(),
                "/claims/" + claim.getId()
        );

        return mapToResponse(saved);
    }

    public List<MessageResponse> getClaimMessages(Long claimId) {
        return messageRepository.findByClaimRequestIdOrderByCreatedAtAsc(claimId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void markMessagesAsRead(Long claimId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        List<Message> messages = messageRepository.findByClaimRequestIdOrderByCreatedAtAsc(claimId);
        messages.stream()
                .filter(m -> !m.getSender().getId().equals(user.getId()) && !m.isRead())
                .forEach(m -> m.setRead(true));
        messageRepository.saveAll(messages);
    }

    private MessageResponse mapToResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .claimId(message.getClaimRequest().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .senderProfilePhoto(message.getSender().getProfilePhoto())
                .content(message.getContent())
                .isRead(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
