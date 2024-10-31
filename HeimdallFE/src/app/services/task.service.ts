import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Task} from "../interfaces/Task";


@Injectable({
  providedIn: 'root'
})
export class TaskService extends ApiService{

  constructor() {
    super();
  }
  private apiUrl = "http://localhost:8082/api/tasks";
  http = inject(HttpClient)
  header= this.createHeader();

  getAllTasksByUser(): Observable<Task[]>{
    return this.http.get<Task[]>(this.apiUrl, { headers: this.header })
  }

  assignTask(username: String, taskUuid: String) {
    const requestBody = {
      uuid: taskUuid,
      users: [
        {
          username: username
        }
      ]
    };
    return this.http.put(this.apiUrl + "/assign", requestBody, { headers: this.header })
  }
}
