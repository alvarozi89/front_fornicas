import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification';
import { AppNotification } from '../../../../core/models/notification';

@Component({
selector: 'app-notifications',
standalone: true,
imports: [CommonModule, DatePipe, RouterLink],
templateUrl: './notifications.html',
styleUrl: './notifications.css'
})
export class Notifications implements OnInit {
private readonly notificationService = inject(NotificationService);
private readonly cdr = inject(ChangeDetectorRef);
notifications: AppNotification[] = [];
isLoading = true;
errorMessage = '';
unreadCount = 0;
ngOnInit(): void {
this.loadNotifications();
this.loadUnreadCount();
}

loadNotifications(): void {
this.isLoading = true;
this.errorMessage = '';


this.notificationService.getMyNotifications().subscribe({
  next: (response) => {
    this.notifications = response.data.notifications;
    this.isLoading = false;
     this.cdr.detectChanges();
  },
  error: (error) => {
    console.error('Error al cargar notificaciones:', error);
    this.errorMessage = 'No fue posible cargar las notificaciones.';
    this.isLoading = false;
     this.cdr.detectChanges();
  }
});


}
loadUnreadCount(): void {
  this.notificationService.getUnreadCount().subscribe({
    next: (response) => {
      this.unreadCount = response.data.unread;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al consultar el contador:', error);
    }
  });
}
markAsRead(notification: AppNotification): void {
  if (notification.is_read) {
    return;
  }

  this.notificationService.markAsRead(notification.id).subscribe({
    next: () => {
      notification.is_read = true;
      this.loadUnreadCount();
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al marcar notificación:', error);
    }
  });
}

markAllAsRead(): void {
this.notificationService.markAllAsRead().subscribe({
next: () => {
this.notifications = this.notifications.map(notification => ({
...notification,
is_read: true
}));
},
error: (error) => {
console.error('Error al marcar todas como leídas:', error);
}
});
}
}
