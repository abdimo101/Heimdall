import {HttpErrorResponse} from "@angular/common/http";
import {Notification} from '../interfaces/Notification.interface';
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {NotificationService} from "../services/notification.service";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {computed, inject} from "@angular/core";
import {debounceTime, pipe, switchMap, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";

interface NotificationState {
  notifications: Notification[];
  notificationsIsLoading: boolean;
  notificationsError: HttpErrorResponse | null;
}

const initialState: NotificationState = {
  notifications: [],
  notificationsIsLoading: false,
  notificationsError: null,
}

export const NotificationStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  withMethods((store, notificationService = inject(NotificationService)) => ({
    fetchNotifications: rxMethod<void>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {notificationsIsLoading: true})),
        switchMap(() => notificationService.getNotifications().pipe(
          tapResponse({
            next: (notifications) => {
              patchState(store, {
                notifications: notifications,
                notificationsError: null,
              });
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                notifications: [],
                notificationsError: error,
              });
            },
            finalize: () => {
              patchState(store, {notificationsIsLoading: false});
            }
          })
        ))
      )
    ),
  })),
  withMethods((store, notificationService = inject(NotificationService)) => ({
    dismissNotification: rxMethod<string>(
      pipe(
        debounceTime(300),
        switchMap((notificationUuid) => notificationService.updateSeenAt(notificationUuid).pipe(
          tapResponse({
            // TODO: Add error & loading
            next: () => {
              store.fetchNotifications();
            },
            error: (error: HttpErrorResponse) => {
            },
            finalize: () => {
            }
          })
        ))
      )
    ),
  })),
  withComputed((state) => ({
    unreadNotifications: computed(() => state.notifications()?.filter(notification => !notification.seen_at)),
    numberOfUnreadNotifications: computed(() => state.notifications()?.filter(notification => !notification.seen_at).length),
  })),
  withHooks({
    onInit(store) {
      store.fetchNotifications();
    }
  })
);
