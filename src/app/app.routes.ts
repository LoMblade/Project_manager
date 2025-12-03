import { Routes } from '@angular/router';
import { ProductListComponent } from './product/product-list.component';
import { ProductFormComponent } from './product/product-form.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  // Trang chủ → chuyển về login nếu chưa đăng nhập
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Authentication routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected product routes - cần đăng nhập
  { path: 'product/list', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'product/add', component: ProductFormComponent, canActivate: [AuthGuard] },
  { path: 'product/edit/:id', component: ProductFormComponent, canActivate: [AuthGuard] },

  // Bắt hết các đường dẫn sai → về login
  { path: '**', redirectTo: 'login' }
];