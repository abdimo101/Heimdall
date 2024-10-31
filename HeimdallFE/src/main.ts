import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {KeycloakService} from 'keycloak-angular';
import {provideStore} from '@ngrx/store';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";

const mergedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    KeycloakService,
    provideStore(),
    provideAnimationsAsync(),
  ]
};

bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error(err));
