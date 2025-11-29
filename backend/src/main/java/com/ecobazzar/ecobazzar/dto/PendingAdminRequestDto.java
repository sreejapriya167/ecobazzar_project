// PendingAdminRequestDto.java
package com.ecobazzar.ecobazzar.dto;

import java.time.LocalDateTime;

public record PendingAdminRequestDto(
    Long id,
    Long userId,
    String userName,
    String userEmail,
    LocalDateTime requestedAt
) {}