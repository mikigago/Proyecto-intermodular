import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AnimacionesComponent } from './animaciones.component';

const routes: Routes = [
  { path: '', component: AnimacionesComponent }
];

@NgModule({
  declarations: [AnimacionesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AnimacionesModule { }
