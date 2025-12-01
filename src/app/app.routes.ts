import { Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list.component';
import { ProductFormComponent } from './product/product-form.component';

export const routes: Routes = [
  // Trang chủ → tự động chuyển về danh sách sản phẩm
  { path: '', redirectTo: 'product/list', pathMatch: 'full' },

  // Danh sách sản phẩm
  { path: 'product/list', component: ProductListComponent },

  // Form thêm mới
  { path: 'product/add', component: ProductFormComponent },

  // Form sửa
  { path: 'product/edit/:id', component: ProductFormComponent },

  // Bắt hết các đường dẫn sai → về danh sách
  { path: '**', redirectTo: 'product/list' }
];