import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  toggleTheme() {
    this.isDarkMode.update(v => {
      const newVal = !v;
      document.body.setAttribute('data-bs-theme', newVal ? 'dark' : 'light');
      return newVal;
    });
  }
}
