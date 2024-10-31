import { inject, Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { Requirement } from '../interfaces/Requirement';
import {RequirementDocument_type} from "../interfaces/requirement-document_type";
import {RequirementWithNames} from "../interfaces/requirement-with-names";

@Injectable({
  providedIn: 'root'
})
export class RequirementService extends ApiService{

  private apiURL = "http://localhost:8082/api/requirements";
  private header = this.createHeader();
  http = inject(HttpClient)

  constructor() {
    super()
  }

  createRequirement(requirement: Requirement): Observable<Requirement>
  {
    const body = JSON.stringify(requirement);
    return this.http.put<Requirement>(this.apiURL, body, { headers: this.header })
  }

  getRequirements(teamUuid: string): Observable<Requirement[]>
  {
    return this.http.get<Requirement[]>(this.apiURL + '/team/' + teamUuid, { headers: this.header })
  }

  deleteRequirement(uuid: String): Observable<any>
  {
    return this.http.delete(this.apiURL + '/' + uuid, { headers: this.header })
  }

  getRequirementsWithDocument_types(teamUuid: string): Observable<RequirementDocument_type[]>
  {
    return this.http.get<RequirementDocument_type[]>(this.apiURL + '/team/' + teamUuid + '/requirement-document-types', { headers: this.header })
  }
  getAllRequirementsExceptTeam(teamUuid: string, phaseUuid: string): Observable<RequirementWithNames[]>
  {
    return this.http.get<Requirement[]>(this.apiURL + '/all-requirements-except/' + teamUuid + '/' +  phaseUuid, { headers: this.header })
  }
}
