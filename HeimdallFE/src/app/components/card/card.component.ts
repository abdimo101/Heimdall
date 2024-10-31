import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full {{additionalStyles}}">
      <div class="p-4 flex-grow">
        <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
        <div class="text-gray-600" [innerHTML]="description"></div>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() additionalStyles: string = '';
}
