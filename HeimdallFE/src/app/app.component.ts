import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CheckLoginComponent} from "./components/check-login/check-login.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CheckLoginComponent],
  template: `
    <app-check-login></app-check-login>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
