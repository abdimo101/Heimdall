import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {KeycloakService} from "../services/keycloak.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloakAuth = inject(KeycloakService);
  const router = inject(Router);

  const isAuthenticated = keycloakAuth.checkAuthorized();

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    keycloakAuth.login();
    return false;
  }

  // If the user is authenticated, allow the route
  return true;
};
