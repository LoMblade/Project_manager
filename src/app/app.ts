import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('product-demo');

  // Thêm Router để điều hướng
  constructor(private router: Router) {}

  // Hàm logout – ĐÃ CÓ → HẾT LỖI NGAY!
  logout() {
    // Xóa hết dữ liệu đăng nhập
    localStorage.clear();
    sessionStorage.clear();

    // Chuyển về trang login (hoặc trang chủ)
    this.router.navigate(['/login']);
    // Nếu bạn chưa có trang login thì dùng: this.router.navigate(['/']);

    // Tùy chọn: thông báo
    console.log('Đã đăng xuất thành công!');
    // Nếu dùng toast: this.toastr.success('Đăng xuất thành công');
  }

  // Bonus: Kiểm tra đã login chưa (dùng để ẩn/hiện Login/Logout)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!localStorage.getItem('currentUser');
  }
}