import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animaciones',
  standalone: false,
  templateUrl: './animaciones.component.html',
  styleUrl: './animaciones.component.css'
})
export class AnimacionesComponent implements OnInit, OnDestroy {

  currentFrameIndex = 0;
  fadeOut = false;

  readonly frames = [
    'assets/sprites/frame-01.png',
    'assets/sprites/frame-02.png',
    'assets/sprites/frame-03.png',
    'assets/sprites/frame-04.png',
    'assets/sprites/frame-05.png',
    'assets/sprites/frame-06.png',
    'assets/sprites/frame-07.png',
    'assets/sprites/frame-08.png',
    'assets/sprites/frame-09.png',
  ];

  private intervalId: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    let loopCount = 0;
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length;
          this.cdr.detectChanges();

          if (this.currentFrameIndex === 0) {
            loopCount++;
            if (loopCount >= 4) {
              clearInterval(this.intervalId);
              this.fadeOut = true;
              this.cdr.detectChanges();
              setTimeout(() => this.router.navigate(['/selector']), 600);
            }
          }
        });
      }, 130);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  get currentFrame(): string {
    return this.frames[this.currentFrameIndex];
  }
}
