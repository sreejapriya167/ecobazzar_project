import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubTitle } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  private auth = inject(AuthService);
  private router = inject(Router);
  loggedIn$ = this.auth.loggedIn$;

  slides = [
 
 
  {
    image: 'hero/wood.webp',
    title: 'wood',
    
    
  },
  {
    image: 'hero/nomoreplastic.webp',
    title:'cup'
   
  },
  {
    image: 'hero/notplastic.webp',
    title:'bag'
    
  },
];

currentSlide = 0;
intervalId: any;

ngOnInit() {
  this.intervalId = setInterval(() => {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }, 4000);
}

ngOnDestroy() {
  clearInterval(this.intervalId);
}

  goToDashboard() {
    const role = this.auth.getRole();
    if (!role) return this.router.navigateByUrl('/login');

    if (role === 'ROLE_ADMIN')  return this.router.navigateByUrl('/admin');
    if (role === 'ROLE_SELLER') return this.router.navigateByUrl('/seller/dashboard');
    return this.router.navigateByUrl('/dashboard');
  }
}
