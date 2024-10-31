import {Component, computed, inject, signal, Signal, WritableSignal} from '@angular/core';
import {IconComponent} from "../../../common/icon.component";
import {NotificationStore} from "../../../../stores/notification.store";
import {Notification} from "../../../../interfaces/Notification.interface";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-header-notifications',
  standalone: true,
  imports: [
    IconComponent,
    DatePipe
  ],
  template: `
    <div class="dropdown z-10">
      <button role="button" class="p-2 rounded hover:bg-gray-800 transition-colors duration-300">
        <app-icon icon="NOTIFICATIONS" [size]="1.5"></app-icon>
        @if (numberOfUnreadNotifications() > 0) {
          <span
            class="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full px-1">{{ unreadNotifications().length }}</span>
        }
      </button>
      <ul class="dropdown-content absolute w-64 bg-gray-900 shadow-lg rounded-b-md">
        <button class="w-full py-1 text-2xs text-center border-b border-gray-700 hover:bg-gray-800 transition-colors duration-300"
                (click)="showReadNotifications.set(!showReadNotifications())">
          <span>Dismissed notifications</span>
          <app-icon class="fixed translate-x-1" [icon]="showReadNotifications() ? 'VISIBILITY' : 'VISIBILITY_OFF'" [size]="1"/>
        </button>
        @if (notificationsToDisplay().length > 0) {
          @for (notification of notificationsToDisplay(); track notification.uuid) {
            <li class="border-b border-gray-700">
              @if (!notification.seen_at) {
                <button
                  class="fixed right-1 p-1 rounded-full hover:bg-gray-800 transition-colors duration-300 ease-in-out"
                  (click)="notificationStore.dismissNotification(notification.uuid)">
                  <app-icon icon="RADIO_BUTTON_UNCHECKED" [size]="1"/>
                </button>
              } @else {
                <div
                  class="fixed right-1 p-1">
                  <app-icon icon="CHECK_CIRCLE" [size]="1"/>
                </div>
              }
              <div class="text-sm"><strong>{{ notification.app_name }}</strong></div>
              <div class="text-sm">{{ notification.title }}</div>
              <div class="text-3xs text-right">
                {{ notification.created_at?.toString() | date:'dd MMM y hh:mm:ss' }}
              </div>
            </li>
          }
        } @else {
          <li class="text-center text-sm">No notifications</li>
        }
      </ul>
    </div>
  `
})
export class HeaderNotificationsComponent {
  protected readonly notificationStore = inject(NotificationStore);
  protected readonly notifications: Signal<Notification[]> = this.notificationStore.notifications;
  protected readonly unreadNotifications: Signal<Notification[]> = this.notificationStore.unreadNotifications;
  protected showReadNotifications: WritableSignal<boolean> = signal(false);
  protected readonly numberOfUnreadNotifications: Signal<number> = this.notificationStore.numberOfUnreadNotifications;
  protected notificationsToDisplay: Signal<Notification[]> = computed(() => {
    if (this.showReadNotifications()) {
      return this.notifications();
    }
    return this.unreadNotifications();
  });
}
