import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selector',
  standalone: false,
  templateUrl: './app-selector.component.html',
  styleUrl: './app-selector.component.css'
})
export class AppSelectorComponent {

  constructor(private router: Router) {}

  goToKExpiration(): void {
    this.router.navigate(['/login']);
  }
}
