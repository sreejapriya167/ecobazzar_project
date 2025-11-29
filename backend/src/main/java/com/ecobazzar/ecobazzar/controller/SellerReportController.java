package com.ecobazzar.ecobazzar.controller;


import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecobazzar.ecobazzar.dto.SellerReport;
import com.ecobazzar.ecobazzar.service.SellerReportService;

@RestController
@RequestMapping("/api/reports/")
public class SellerReportController {
	
	private final SellerReportService sellerReportService;
	
	public SellerReportController(SellerReportService sellerReportService) {
		this.sellerReportService = sellerReportService;
	}
	
	@PreAuthorize("hasRole('SELLER')")
	@GetMapping("/seller")
	public SellerReport getSellerRepost(Authentication auth) {
		String email = auth.getName();
		return sellerReportService.getSellerReport(email);
	}
	
	@GetMapping("/seller/sales")
	@PreAuthorize("hasRole('SELLER')")
	public List<Map<String,Object>> getSellerSales(Authentication auth, @RequestParam(defaultValue="7") int days){
	    return sellerReportService.getSellerSales(auth.getName(), days);
	}


}
