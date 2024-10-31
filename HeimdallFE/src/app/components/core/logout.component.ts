import { Component } from '@angular/core';
import {KeycloakService} from "../../services/keycloak.service";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: ``
})
export class LogoutComponent {
  constructor(keycloakService: KeycloakService) {
    keycloakService.logout();
  }
}
