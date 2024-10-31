import {inject, Injectable, signal, WritableSignal } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Notification } from '../interfaces/Notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ApiService{
  private apiURL = "http://localhost:8082/api/notifications";
  private header = this.createHeader();
  private notificationSignal: WritableSignal<Notification[]> = signal([])
  http = inject(HttpClient)

  constructor() {
    super()
  }

  get notifications() {
    return this.notificationSignal.asReadonly();
  }

  getNotifications(): Observable<Notification[]>
  {
    return this.http.get<Notification[]>(this.apiURL + '/user/', { headers: this.header })
  }

  updateSeenAt(notificationUuid: String)
  {
    return this.http.get(this.apiURL + '/user/' + notificationUuid, { headers: this.header })
  }
}
