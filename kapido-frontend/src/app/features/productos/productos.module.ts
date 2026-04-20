import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProductoListComponent } from './producto-list/producto-list.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';

const routes: Routes = [
  { path: '', component: ProductoListComponent },
  { path: 'nuevo', component: ProductoFormComponent },
  { path: 'editar/:id', component: ProductoFormComponent }
];

@NgModule({
  declarations: [
    ProductoListComponent,
    ProductoFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductosModule { }
