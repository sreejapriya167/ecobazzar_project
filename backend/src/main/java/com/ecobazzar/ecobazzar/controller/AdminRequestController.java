package com.ecobazzar.ecobazzar.controller;

import com.ecobazzar.ecobazzar.dto.PendingAdminRequestDto;
import com.ecobazzar.ecobazzar.model.User;
import com.ecobazzar.ecobazzar.repository.UserRepository;
import com.ecobazzar.ecobazzar.service.AdminRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-request")
public class AdminRequestController {

    private final AdminRequestService service;
    private final UserRepository userRepository;

    public AdminRequestController(AdminRequestService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    @PostMapping("/request")
    public ResponseEntity<Map<String, String>> requestAccess(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, String> response = new HashMap<>();
        try {
            service.requestAdminAccess(user.getId());
            response.put("message", "Admin access requested successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String msg = e.getMessage();
            if (msg.contains("already an admin") || msg.contains("pending admin request")) {
                response.put("message", msg);
                return ResponseEntity.status(409).body(response);
            }
            throw e;
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<PendingAdminRequestDto> getPending() {
        return service.getPendingRequests().stream()
            .map(req -> new PendingAdminRequestDto(
                req.getId(),
                req.getUser().getId(),
                req.getUser().getName(),
                req.getUser().getEmail(),
                req.getRequestedAt()
            ))
            .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/approve/{id}")
    public ResponseEntity<Map<String, String>> approve(@PathVariable Long id) {
        service.approveRequest(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "User promoted to Admin successfully");
        return ResponseEntity.ok(res);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/reject/{id}")
    public ResponseEntity<Map<String, String>> reject(@PathVariable Long id) {
        service.rejectRequest(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Admin request rejected");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/has-pending")
    public boolean hasPending() {
        return service.hasPendingRequests();
    }
}