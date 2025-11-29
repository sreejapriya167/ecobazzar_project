// PendingSellerDto.java
package com.ecobazzar.ecobazzar.dto;

public record PendingSellerDto(
    Long id,
    String name,
    String email,
    int productCount
) {}