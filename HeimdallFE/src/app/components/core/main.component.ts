import {Component, inject} from '@angular/core';
import {HeaderComponent} from "./ui/header/header.component";
import {SidebarComponent} from "./ui/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {SessionStore} from "../../stores/global/session.store";
import {SpinnerComponent} from "../common/spinner.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
    SpinnerComponent
  ],
  styles: `
    .main-content {
      scrollbar-gutter: stable;
      scrollbar-width: thin;
    }
  `,
  template: `
    <div class="grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] h-screen bg-base-200">
      @if (initialized()){
      <app-header class="col-span-full"/>
      <app-sidebar/>
      <main class="main-content row-start-2 col-start-2 pl-6 pr-4 pt-6 pb-6 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    } @else {
    <div class="col-span-full row-span-full flex flex-col gap-2 items-center justify-center">
      <app-spinner [size]="4"/>
      <div class="text-2xl text-gray-500">Loading...</div>
    </div>
    }
    </div>
  `
})
export class MainComponent {
  protected readonly initialized = inject(SessionStore).initialized;
}
