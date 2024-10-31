import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Phase} from "../interfaces/phase";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PhaseService extends ApiService {

  private apiURL = "http://localhost:8082/api/phases";
  private header = this.createHeader();
  http = inject(HttpClient)

  constructor() {
    super()
  }
  getAllPhases(): Observable<Phase[]> {
    return this.http.get<Phase[]>(this.apiURL, { headers: this.header })
  }
  createOrUpdate(phase: Phase): Observable<Phase> {
   let jsonPhase = JSON.stringify(phase)
    console.log(jsonPhase)
    return this.http.put(this.apiURL, jsonPhase, { headers: this.header })
  }
  deletePhase(uuid: string): Observable<any> {
    return this.http.delete(this.apiURL + '/' + uuid, { headers: this.header })
  }
}
