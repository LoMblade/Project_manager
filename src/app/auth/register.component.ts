import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

// Custom validator để kiểm tra mật khẩu xác nhận
export function passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {
    // Đánh dấu tất cả field đã touched để hiển thị lỗi
    this.markFormGroupTouched();

    // Kiểm tra mật khẩu có khớp không
    const { email, password, confirmPassword } = this.registerForm.value;

    if (!email || !password || !confirmPassword) {
      const msg = 'Vui lòng điền đầy đủ thông tin';
      this.errorMessage = msg;
      this.notificationService.warning(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Mật khẩu xác nhận không khớp';
      this.errorMessage = msg;
      this.notificationService.warning(msg);
      return;
    }

    if (password.length < 6) {
      const msg = 'Mật khẩu phải có ít nhất 6 ký tự';
      this.errorMessage = msg;
      this.notificationService.warning(msg);
      return;
    }

    // Nếu mọi thứ OK thì đăng ký
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({ email, password, confirmPassword }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.notificationService.success('Đăng ký thành công! Chuyển sang trang đăng nhập...');
          // Chuyển sang trang đăng nhập sau khi đăng ký thành công
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        const message = error.message || 'Đăng ký thất bại';
        this.errorMessage = message;
        this.notificationService.error(message);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter để kiểm tra validation trong template
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
