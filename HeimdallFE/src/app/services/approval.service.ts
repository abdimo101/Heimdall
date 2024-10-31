import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Approval} from "../interfaces/approval";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApprovalService extends ApiService{

  private apiUrl = "http://localhost:8082/api/approvals";

  http = inject(HttpClient)
  header= this.createHeader();

  constructor(){
    super();
  }

  createOrUpdateApproval(approval: Approval): Observable<Approval> {
    const approvalJson = JSON.stringify(approval);
    return this.http.put<Approval>(this.apiUrl, approvalJson, { headers: this.header })
  }

  getApproval(approvalUuid: String): Observable<Approval> {
    return this.http.get<Approval>(this.apiUrl + "/" + approvalUuid, { headers: this.header })
  }

  setStatus(body: string): Observable<any> {
     return this.http.put(this.apiUrl + "/set-status", body, { headers: this.header })
  }
}
