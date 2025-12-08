import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications: Observable<Notification[]> = this.notifications$.asObservable();

  constructor() {}

  // Thêm thông báo
  private addNotification(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, notification]);

    // Tự động xóa thông báo sau 5 giây
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  // Success notification
  success(message: string) {
    this.addNotification('success', message);
  }

  // Error notification
  error(message: string) {
    this.addNotification('error', message);
  }

  // Warning notification
  warning(message: string) {
    this.addNotification('warning', message);
  }

  // Info notification
  info(message: string) {
    this.addNotification('info', message);
  }

  // Xóa thông báo
  removeNotification(id: string) {
    const currentNotifications = this.notifications$.value;
    this.notifications$.next(
      currentNotifications.filter(n => n.id !== id)
    );
  }

  // Xóa tất cả thông báo
  clearAll() {
    this.notifications$.next([]);
  }

  // Lấy danh sách thông báo hiện tại
  getNotifications(): Notification[] {
    return this.notifications$.value;
  }
}
