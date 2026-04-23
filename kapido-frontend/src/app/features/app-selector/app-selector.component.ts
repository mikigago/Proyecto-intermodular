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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const appUrl = window.location.origin;
    QRCode.toDataURL(appUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#ffffff', light: '#1e3a52' }
    }).then(dataUrl => {
      this.qrDataUrl = dataUrl;
      this.cdr.detectChanges();
    });
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
