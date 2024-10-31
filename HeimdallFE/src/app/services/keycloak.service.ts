import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';
import { keycloakConfig } from '../keycloak.config';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak?: Keycloak; // Make keycloak optional


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Initialize Keycloak
  init(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      this.keycloak = new Keycloak(keycloakConfig); // Initialize only if in the browser
      return this.keycloak.init({
        onLoad: 'check-sso',
      }).then(authenticated => {
        if (!authenticated) {
          console.log('User is not authenticated');
        }
        return authenticated;
      }).catch(error => {
        console.error('Keycloak initialization failed', error);
        return false;
      });
    } else {
      return Promise.resolve(false); // Skip initialization on the server
    }
  }

  login(): void {
    if (this.keycloak) {
      this.keycloak.login()
    }
  }

  logout(): void {
    if(this.keycloak)
    {
      this.keycloak.logout()
    }
  }

  checkAuthorized(): boolean {
    if (this.keycloak) {
      return <boolean>this.keycloak.authenticated
    }
    return false;
  }

  getUsername(): string {
    return this.keycloak?.tokenParsed?.['name'];
  }
  getEmail(): string {
    return this.keycloak?.tokenParsed?.['email'];
  }

  getAccessToken() {
   return this.keycloak?.token
  }
}
