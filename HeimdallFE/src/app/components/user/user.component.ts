import { Component, inject } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../../services/user.service";
import { UserDetails } from '../../interfaces/UserDetails';
import { AsyncPipe, JsonPipe } from "@angular/common";
import { CapitalizeFirstPipe } from "../../pipes/capitalize-first.pipe";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CardComponent,
    AsyncPipe,
    JsonPipe,
    CapitalizeFirstPipe,
  ],
  template: `
    <div class="flex justify-center">
      <!-- Main Container: Flex row to handle horizontal and vertical alignment -->
      <div class="flex flex-1 min-h-[50vh] max-w-4xl w-full">
        <!-- Horizontal Cards Container -->
        <div class="flex flex-col w-full flex-2 gap-6 mr-10">
          <!-- Large Card -->
          <div class="flex-2">
            <app-card
                [title]="'User Information'"
                [description]="'Detailed information about the user'"
                class="w-full">
              <div><strong>Name:</strong> {{ this.user?.name }}</div>
              <div class='mt-2'><strong>Email:</strong> {{ this.user?.email }}</div>
            </app-card>
          </div>
          <!-- Teams Table -->
          <div class="mb-8">
            <div class="flex justify-center p-2 mb-4">
              <p class="text-2xl font-bold">{{ this.user?.name }}'s Teams</p>
            </div>
            <div class="bg-white shadow-md rounded-lg overflow-x-auto mt-4 w-full">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-800 text-white">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (team of user?.teams; track team.uuid) {
                    <tr class="hover:bg-gray-100 cursor-pointer" (click)="navigateToTeam(team.uuid)">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ team.name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ team.type ?? 'N/A' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ team.description ?? 'N/A' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UserComponent {
  userUuid: string = '';
  user: UserDetails | undefined;
  userService = inject(UserService);
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userUuid = this.route.snapshot.paramMap.get('id') || '';
    this.userService.getSingleUserDetails(this.userUuid).subscribe(user => {
      this.user = user;
    });
  }

  navigateToTeam(uuid: String | undefined) {
    this.router.navigate(['/org/team', uuid]);
  }
}
