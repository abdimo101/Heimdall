import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {Organization} from "../interfaces/organization.interface";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends ApiService{
  private apiURL = "http://localhost:8082/api/organizations";
  private header = this.createHeader();
  http = inject(HttpClient)

  constructor() {
    super()
  }

  getOwnOrganization(): Observable<Organization> {
    return this.http.get<Organization>(this.apiURL + "/my", { headers: this.header })
  }
}
