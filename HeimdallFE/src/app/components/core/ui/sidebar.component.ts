import {Component, effect, inject} from '@angular/core';
import {UiStore} from "../../../stores/global/ui.store";
import {SessionStore} from "../../../stores/global/session.store";
import {RouterLink} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";
import {Team} from "../../../interfaces/Team.interface";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  styles: `
    details > summary:first-of-type {
      list-style-type: none;
    }details summary::after {
       content: '\u25C0';
       float: right;
       padding-right: 0.5rem;
     }

    details[open] summary::after {
      content: '\u25BC';
      float: right;
      padding-right: 0.5rem;
    }

    details summary, details ul li {
      user-select: none;
    }
  `,
  animations: [
    trigger('slideInOutAnimation', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-in-out', style({transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)'}),
        animate('300ms ease-in-out', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ],
  imports: [
    RouterLink
  ],
  template: `
    @if (sidebarOpen()) {
      <aside @slideInOutAnimation [@.disabled]="initializing"
             class="min-w-64 max-w-64 h-full bg-gray-900 text-gray-100 px-4 py-2">
        <h1 class="flex justify-center mb-2 text-2xl font-bold">
          <a draggable="false" routerLink="/org/home">{{ organization()?.name ? organization()?.name : '' }}</a>
        </h1>
        <nav class="rounded-md overflow-hidden">
          <ul>
            @for (category of menuContent; track category.name) {
              <details>
                <summary class="pl-2 py-2 bg-gray-800 cursor-pointer">
                  <strong>{{ category.name }}</strong>
                </summary>
                <ul>
                  @for (item of category.items; track item.name) {
                    <li class="bg-gray-700 hover:bg-gray-600 transition-colors ease-in-out duration-300">
                      <a class="block pl-2 py-1" draggable="false" routerLink="{{ item.route }}">{{ item.name }}</a>
                    </li>
                  }
                </ul>
              </details>
            }
          </ul>
        </nav>
      </aside>
    }
  `
})
export class SidebarComponent {
  protected readonly sidebarOpen = inject(UiStore).sidebarOpen;
  protected readonly organization = inject(SessionStore).userOrganization;
  private readonly allTeams = inject(SessionStore).allTeams;
  private readonly defaultCategories = {
    applications: <SidebarMenuCategory>{
      name: 'Applications',
      items: [
        <SidebarMenuItem>{name: 'Application List', route: '/org/applicationlist'},
        <SidebarMenuItem>{name: 'Application Setup', route: '/org/applicationsetup'},
      ],
    },
    teams: <SidebarMenuCategory>{
      name: 'Teams',
      items: [
        <SidebarMenuItem>{name: 'All Teams', route: '/org/allteams'},
        <SidebarMenuItem>{name: 'Create Team', route: '/org/teams/create'},
      ],
    },
    about: <SidebarMenuCategory>{
      name: 'About',
      items: [
        <SidebarMenuItem>{name: 'About', route: '/org/aboutnorthtech'},
      ],
    },
    settings: <SidebarMenuCategory>{
      name: 'Settings',
      items: [
        <SidebarMenuItem>{name: 'Go to settings', route: '/org/settings'},
      ],
    },
  }

  protected menuContent: SidebarMenuCategory[] = [];

  initializing = true;

  ngOnInit() {
    // Allow component to initialize before enabling animations
    setTimeout(() => this.initializing = false, 300);
  }

  updateMenuEffect = effect(() => {
    this.allTeams();
    let newTeamsCategory = this.populateCategory(
      this.cloneCategory(this.defaultCategories.teams),
      this.allTeams() || []
    );
    this.menuContent = [
      this.defaultCategories.applications,
      newTeamsCategory,
      this.defaultCategories.about,
      this.defaultCategories.settings
    ];
  });

  cloneCategory(category: SidebarMenuCategory): SidebarMenuCategory {
    return {
      name: category.name,
      items: category.items.slice(),
    };
  }

  populateCategory(category: SidebarMenuCategory, teams: Team[]) {
    for (let team of teams) {
      category.items.push({name: team.name.toString(), route: '/org/team/' + team.uuid});
    }
    return category;
  }
}

interface SidebarMenuCategory {
  name: string;
  items: SidebarMenuItem[];
}

interface SidebarMenuItem {
  name: string;
  route: string;
}
