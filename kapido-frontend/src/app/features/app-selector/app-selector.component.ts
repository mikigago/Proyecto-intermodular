import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-selector',
  standalone: false,
  templateUrl: './app-selector.component.html',
  styleUrl: './app-selector.component.css'
})
export class AppSelectorComponent implements OnInit {
  qrDataUrl: string = '';
  qrVisible: boolean = false;
  readonly year = new Date().getFullYear();

  cookiesAccepted: boolean = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // QR
    const appUrl = 'https://mikigago.github.io/Proyecto-intermodular/';
    QRCode.toDataURL(appUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#ffffff', light: '#1e3a52' }
    }).then(dataUrl => {
      this.qrDataUrl = dataUrl;
      this.cdr.detectChanges();
    });
    // Cookies
    //this.cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
  }

  aceptarCookies(): void {
    this.cookiesAccepted = true;
    localStorage.setItem('cookiesAccepted', 'true');
  }

  goToKExpiration(): void {
    this.router.navigate(['/login']);
  }

  abrirQr(): void {
    this.qrVisible = true;
  }

  cerrarQr(): void {
    this.qrVisible = false;
  }
}
