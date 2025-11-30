import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private dark = false;

  constructor() {
    this.dark = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.dark = !this.dark;
    localStorage.setItem('theme', this.dark ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    const html = document.documentElement;
    if (this.dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  isDark() {
    return this.dark;
  }
}
