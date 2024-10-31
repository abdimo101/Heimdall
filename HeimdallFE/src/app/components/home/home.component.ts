import { Component } from '@angular/core';
import {CardComponent} from "../card/card.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardComponent,
  ],
  template:`
    <div class="flex justify-center -mb-4">
      <p class="text-2xl">North Tech</p>
    </div>
    <div class="p-14 flex h-5/6 justify-center">
      <!-- Main Container: Flex row to handle horizontal and vertical alignment -->
        <!-- Horizontal Cards Container -->
        <div class="flex flex-col justify-center w-5/6 gap-6">
          <!-- Large Card -->
          <div class="flex-grow">
            <app-card
              [title]="'This Card will show the 3 lowest scoring applications'"
              [description]="'Shows the applications with the lowest scores so they know what they need to focus on'"
              class="w-full h-full">
            </app-card>
          </div>

          <!-- Smaller Cards Container -->
          <div class="flex gap-6 flex-1">
            <app-card
              [imageUrl]="'https://via.placeholder.com/600x475'"
              [title]="'Graph of score'"
              [description]="'This card will show a graph of how the organisation score overall have developed'"
              class="flex-1">
            </app-card>

            <app-card
              [imageUrl]="'https://via.placeholder.com/600x475'"
              [title]="'Newest rises in score'"
              [description]="'This card will show the top 3 newest rises in score'"
              class="flex-1">
            </app-card>
          </div>
        </div>
      </div>
  `
})
export class HomeComponent {
}
