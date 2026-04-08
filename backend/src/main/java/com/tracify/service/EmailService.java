package com.tracify.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    /**
     * Simulates sending an email.
     * In a real production scenario, this would use JavaMailSender and be configured via SMTP properties.
     */
    public void sendEmail(String toAddress, String subject, String body) {
        log.info("================ EMAIL DISPATCH ================");
        log.info("TO: {}", toAddress);
        log.info("SUBJECT: {}", subject);
        log.info("BODY:\n{}", body);
        log.info("================================================");
    }
}
