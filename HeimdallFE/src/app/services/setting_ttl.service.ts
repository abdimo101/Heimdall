import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { TTLDisplay } from '../interfaces/TTLDisplay';

@Injectable({
  providedIn: 'root'
})
export class Setting_TTLService extends ApiService{

  private apiUrl = "http://localhost:8082/api/setting-ttl";

  http = inject(HttpClient)
  header= this.createHeader();

  constructor(){
    super();
  }

  TTLDisplay(documentUuid: String | undefined): Observable<TTLDisplay> {
    return this.http.get<any>(this.apiUrl + '/document/' + documentUuid, { headers: this.header });
  }
  findAllByOrganizationUuid(organizationUuid: String): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/organization/' + organizationUuid, { headers: this.header });
  }
  createOrUpdateTTL(body: any): Observable<any> {
    let jsonBody = JSON.stringify(body);
    return this.http.put(this.apiUrl, jsonBody, { headers: this.header });
  }
  deleteTTL(uuid: String): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + uuid, { headers: this.header });
  }

}
