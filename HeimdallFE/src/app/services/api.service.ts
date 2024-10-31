import {inject, Injectable} from '@angular/core';
import {KeycloakService} from "./keycloak.service";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  keycloak = inject(KeycloakService)
  token = this.keycloak.getAccessToken()

  createHeader()
  {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ` + this.token
    });
  }
}
