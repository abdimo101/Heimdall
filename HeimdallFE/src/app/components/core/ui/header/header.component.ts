import {Component, effect, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {IconComponent} from "../../../common/icon.component";
import {UiStore} from "../../../../stores/global/ui.store";
import {SessionStore} from "../../../../stores/global/session.store";
import {DropdownItem, HeaderDropdownComponent} from "./header-dropdown.component";
import {HeaderNotificationsComponent} from "./header-notifications.component";


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    IconComponent,
    RouterLinkActive,
    HeaderDropdownComponent,
    HeaderNotificationsComponent
  ],
  template: `
    <header class="flex bg-gray-900 text-white max-h-12 min-h-12 border-b-2 items-center justify-between shadow-lg">
      <div class="flex max-w-64 min-w-64 justify-between">
        <button class="p-2 rounded hover:bg-gray-800 transition-colors duration-300" (click)="toggleSidebar()">
          <app-icon icon="DOCK_TO_RIGHT" [size]="1.5"></app-icon>
        </button>
        <h1 class="flex justify-center text-2xl font-bold">
          <a class="content-center" draggable="false" routerLink="/org/home">Heimdall</a>
        </h1>
        <div class="p-2 w-10"></div>
      </div>
      <div class="flex items-center gap-2 mr-1">
        <app-header-notifications/>
        <app-header-dropdown class="z-10" buttonText="My Teams" [dropdownItems]="teamsDropdownItems"/>
        <app-header-dropdown class="z-10" [buttonText]="this.user()?.name || ''" [dropdownItems]="userDropdownItems"/>
      </div>
    </header>
  `
})

export class HeaderComponent {
  protected readonly toggleSidebar = inject(UiStore).toggleSidebar;
  protected readonly user = inject(SessionStore).user;
  protected readonly userTeams = inject(SessionStore).userTeams;
  protected readonly userDropdownItems: DropdownItem[] = [
    {text: 'Settings', route: '/org/settings'},
    {text: 'Logout', route: '/logout'}
  ];
  protected teamsDropdownItems: DropdownItem[] = [];

  updateTeamsDropdownItemsEffect = effect(() => {
      let newTeamsDropdownItems: DropdownItem[] = [];
      let teams = this.userTeams();
      if(!teams) return;
      for(let team of teams) {
        newTeamsDropdownItems.push({text: team.name.toString(), route: '/org/team/' + team.uuid});
      }
      this.teamsDropdownItems = newTeamsDropdownItems;
    }
  );
}
