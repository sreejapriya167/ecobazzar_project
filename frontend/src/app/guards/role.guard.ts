import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export const RoleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const role = localStorage.getItem("role");
  const allowedRoles = (route.data?.["roles"] as string[]) || [];

  if (role && allowedRoles.includes(role)) {
    return true;
  }

  // Show feedback to the user
  toastr.error("Access denied. You do not have permission.", "Forbidden");

  // Redirect to home or dashboard
  router.navigate(["/"]);
  return false;
};