import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {}

  // Kiểm tra xem có token trong localStorage không
  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Đăng nhập
  login(email: string, password: string): Observable<any> {
    // Giả lập API call - trong thực tế sẽ gọi API thật
    return new Observable(observer => {
      // Giả lập delay
      setTimeout(() => {
        if (email && password && password.length >= 6) {
          // Tạo token giả
          const token = 'fake-jwt-token-' + Date.now();
          localStorage.setItem('authToken', token);
          localStorage.setItem('userEmail', email);
          this.isAuthenticatedSubject.next(true);
          observer.next({ success: true, token, message: 'Đăng nhập thành công!' });
          observer.complete();
        } else {
          observer.error({ success: false, message: 'Email và mật khẩu không hợp lệ (mật khẩu ít nhất 6 ký tự)' });
        }
      }, 500); // Giảm delay để test nhanh hơn
    });
  }

  // Đăng ký
  register(userData: { email: string; password: string; confirmPassword: string }): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        // Kiểm tra cơ bản
        if (!userData.email || !userData.password) {
          observer.error({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
          return;
        }

        // Giả lập đăng ký thành công - chấp nhận mọi email và password
        const token = 'fake-jwt-token-' + Date.now();
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', userData.email);
        this.isAuthenticatedSubject.next(true);
        observer.next({ success: true, token, message: 'Đăng ký thành công!' });
        observer.complete();
      }, 500); // Giảm delay để test nhanh hơn
    });
  }

  // Đăng xuất
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Lấy thông tin user
  getCurrentUser(): string | null {
    return localStorage.getItem('userEmail');
  }
}
