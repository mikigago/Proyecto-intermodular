import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppSelectorComponent } from './app-selector.component';

const routes: Routes = [
  { path: '', component: AppSelectorComponent }
];

@NgModule({
  declarations: [AppSelectorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AppSelectorModule { }
