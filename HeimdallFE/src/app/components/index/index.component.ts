import {Component, effect, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {KeycloakService} from "../../services/keycloak.service";


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './index.component.html'
})
export class IndexComponent {
  constructor(protected keycloak: KeycloakService, private router: Router) {}


}
