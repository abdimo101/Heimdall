import {inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Document_type} from "../interfaces/document_type";

@Injectable({
  providedIn: 'root'
})
export class Document_typeService extends ApiService {

  private apiUrl = "http://localhost:8082/api/document-types";
  http = inject(HttpClient)
  header= this.createHeader();
  constructor() {
    super();
  }
  getDocumentType(document_type_uuid: String): Observable<Document_type> {
    return this.http.get<Document_type>(this.apiUrl + '/' + document_type_uuid, { headers: this.header });
  }

  searchDocument_types(query: string): Observable<[Document_type]>{
    return this.http.post<[Document_type]>(this.apiUrl + "/search", JSON.stringify({query: query}), { headers: this.header });
  }

  createOrUpdate(body: Document_type): Observable<Document_type>{
    return this.http.put<Document_type>(this.apiUrl, JSON.stringify(body), { headers: this.header });
  }

  missingDocuments(application_uuid: String, phase: String): Observable<String[]> {
    return this.http.get<String[]>(this.apiUrl + '/missing/' + application_uuid + '/' + phase, { headers: this.header });
  }
}
