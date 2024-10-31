import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/index/index.component').then(
        (c) => c.IndexComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about/about.component').then(
        (c) => c.AboutComponent
      ),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./components/core/logout.component').then(
        (c) => c.LogoutComponent
      ),
  },
  {
    path: 'org',
    loadComponent: () =>
      import('./components/core/main.component').then(
        (c) => c.MainComponent
      ),
    canActivate: [authGuard], // Protecting this route
    children: [
      {
        path: 'mytasks',
        loadComponent: () =>
          import('./components/mytasks/mytasks.component').then(
            (c) => c.MytasksComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (c) => c.HomeComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'application/:uuid/:documentTypeUuid/:documentUuid',
        loadComponent: () =>
          import('./components/document-container/document-container.component').then((c) => c.DocumentContainerComponent),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'applicationlist',
        loadComponent: () =>
          import('./components/application-list/application-list.component').then(
            (c) => c.ApplicationListComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'applicationsetup',
        loadComponent: () =>
          import('./components/application-setup/application-setup.component'
            ).then((c) => c.ApplicationSetupComponent),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'application/:uuid',
        loadComponent: () =>
          import('./components/application/application.component').then(
            (c) => c.ApplicationComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'teams/create',
        loadComponent: () =>
          import('./components/team-create/team-create.component').then(
            (c) => c.TeamCreateComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'allteams',
        loadComponent: () =>
          import('./components/all-teams/all-teams.component').then(
            (c) => c.AllTeamsComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'team/:uuid',
        loadComponent: () =>
          import('./components/team/team.component').then(
            (c) => c.TeamComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'aboutnorthtech',
        loadComponent: () =>
          import('./components/about-north-tech/about-north-tech.component'
            ).then((c) => c.AboutNorthTechComponent),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('./components/user/user.component').then(
            ).then((c) => c.UserComponent),
        canActivate: [authGuard], // Protecting this route
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/settings/settings.component').then(
            (c) => c.SettingsComponent
          ),
        canActivate: [authGuard], // Protecting this route
      },
    ],
  },
];
