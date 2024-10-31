import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {ApplicationDetails} from "../interfaces/ApplicationDetails";
import {Observable} from "rxjs";
import {Document} from "../interfaces/document";
import {Application} from "../interfaces/Application";
import {ApplicationHistory} from "../interfaces/Application.history.interface";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends ApiService {

  private apiUrl = "http://localhost:8082/api/applications";
  http = inject(HttpClient)
  header= this.createHeader();
  constructor() {
    super();
  }

  CreateOrUpdateApplication(application: Application) {
    const createdApplicationJson = JSON.stringify(application);
    return this.http.put<Application>(this.apiUrl, createdApplicationJson, { headers: this.header })
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl, { headers: this.header });
  }

  getApplicationsWithUserDetails(): Observable<ApplicationDetails[]> {
    return this.http.get<ApplicationDetails[]>(this.apiUrl + '/userdetails', { headers: this.header });
  }
  getSingleApplication(uuid: String): Observable<Application> {
    return this.http.get<Application>(this.apiUrl + '/' + uuid, { headers: this.header });
  }
  getSingleApplicationDetails(uuid: string): Observable<ApplicationDetails> {
    return this.http.get<ApplicationDetails>(this.apiUrl + '/details/' + uuid, { headers: this.header });
  }
  getDocumentByApplicationAndType(applicationUuid: String, type: String) {
    return this.http.get<Document>(this.apiUrl + '/' + applicationUuid + '/documents/' + type, { headers: this.header });
  }
  changePhase(applicationUuid: String, phase: String) {
    return this.http.put(this.apiUrl + '/' + applicationUuid + '/phase/' + phase, {}, { headers: this.header });
  }
  getApplicationHistory(applicationUuid: String): Observable<ApplicationHistory[]> {
    return this.http.get<ApplicationHistory[]>(this.apiUrl + '/' + applicationUuid + '/history', { headers: this.header });
  }
}
