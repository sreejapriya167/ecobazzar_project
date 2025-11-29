import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent {
  isSignUpMode = false;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        alert('Login successful!');
        this.router.navigate(['/']); // Redirect to home or dashboard
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed. Please check your credentials.');
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const { name, email, password } = this.registerForm.value;

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        alert('Registration successful! You can now log in.');
        this.toggleMode(); // Switch to login view
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again.');
        this.isLoading = false;
      }
    });
  }
}
