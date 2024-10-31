import {Component, Input} from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-header-dropdown',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <div class="dropdown">
      <button role="button" class="h-10 min-w-32 rounded text-sm whitespace-nowrap hover:bg-gray-800 transition-colors duration-300 ease-in-out">
        {{ buttonText }}
      </button>
      <ul class="dropdown-content bg-gray-900 rounded-b-md w-full p-2">
        @for (item of dropdownItems; track item.text) {
          <li class="hover:bg-gray-800 cursor-pointer transition-colors ease-in-out duration-300">
            <a class="block visited:text-white text-sm" draggable="false" routerLink="{{ item.route }}">{{ item.text }}</a>
          </li>
        }
      </ul>
    </div>
  `
})
export class HeaderDropdownComponent {
  @Input() buttonText: string = '';
  @Input() dropdownItems: DropdownItem[] = [];

  router: Router;

  constructor(router: Router) {
    this.router = router;
  }
}

export interface DropdownItem {
  text: string;
  route?: string;
}
