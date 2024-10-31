import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SettingService extends ApiService {

  private apiUrl = "http://localhost:8082/api/settings";
  http = inject(HttpClient)
  header= this.createHeader();
  constructor() {
    super();
  }
  getSettingsByOrganizationUuid(uuid: String)
  {
    return this.http.get(this.apiUrl + "/" + uuid, { headers: this.header });
  }

  updateDefaultTTL(body: any)
  {
    let jsonBody = JSON.stringify(body);
    return this.http.put(this.apiUrl, jsonBody, { headers: this.header });
  }
}
