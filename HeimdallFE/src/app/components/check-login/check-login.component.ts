import { Component, effect, inject } from '@angular/core';
import { KeycloakService } from '../../services/keycloak.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-check-login',
  standalone: true,
  imports: [],
  template: ``
})
export class CheckLoginComponent {
  constructor(
    protected keycloak: KeycloakService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  userService = inject(UserService);

  checkAuth = effect(() => {
    let intendedUrl = '/';
    if (typeof window !== 'undefined' && window.location) {
      intendedUrl = window.location.pathname; // Store the intended URL
    }

    if (this.keycloak.checkAuthorized()) {
      this.userService.checkAndCreateUser().subscribe({
        next: (response) => {
          if (response) {
            console.log('user did not exist but was created: ', response);
          } else if (!response) {
            console.log('Login successful, user already exists in database');
          }
          if (intendedUrl === '/') {
            this.router.navigate(['/org/applicationlist']);
          } else {
            this.router.navigate([intendedUrl]); // Navigate to the intended URL
          }
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  });
}
