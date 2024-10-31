import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Document} from "../interfaces/document";
import {Observable} from "rxjs";
import { ApprovalAuditInfo } from '../interfaces/ApprovalAuditInfo.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends ApiService {

private apiUrl = "http://localhost:8082/api/documents";
  http = inject(HttpClient)
  header= this.createHeader();
  constructor() {
    super();
  }

  createOrUpdateDocument(document: Document){
    const documentJson = JSON.stringify(document);
    return this.http.put(this.apiUrl, documentJson, { headers: this.header });
  }

  getDocument(documentUuid: String): Observable<Document> {
    return this.http.get<Document>(this.apiUrl + '/' + documentUuid, { headers: this.header });
  }

  getDocumentByApproval(approvalUuid: String): Observable<Document> {
    return this.http.get<Document>(this.apiUrl + '/approval/' + approvalUuid, { headers: this.header });
  }

  documentsApprovalCheck(application_uuid: String, phase: String): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiUrl + '/approvalcheck/' + application_uuid + '/' + phase, { headers: this.header });
  }
  initiateDocumentApproval(document_uuid: String){
    let body = {
      document_uuid: document_uuid
    }
    let bodyJSON = JSON.stringify(body);
    return this.http.post(this.apiUrl + '/initiateapproval/', bodyJSON, { headers: this.header });
  }

  getLatestApprovalByDocument(document_uuid: String): Observable<ApprovalAuditInfo> {
    return this.http.get<ApprovalAuditInfo>(this.apiUrl + '/approvalaudit/' + document_uuid, { headers: this.header });
  }
  deleteDocument(uuid: String){
    return this.http.delete(this.apiUrl + '/' + uuid, { headers: this.header });
  }
}
