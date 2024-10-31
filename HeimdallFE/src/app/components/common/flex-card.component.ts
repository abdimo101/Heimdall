import {Component, Input} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-flex-card',
  standalone: true,
  imports: [
    NgClass,
  ],
  template: `
    <div class="w-full h-full{{' ' + replaceClass}}"
         [ngClass]="addClass">
      @if (heading) {
        <div class="{{getTextAlign}}">
          <h2 class="text-xl text-base-content font-bold">{{ heading }}</h2>
          @if (subheading) {
            <div class="text-base-content">{{ subheading }}</div>
          }
        </div>
      }
      <ng-content class="w-full h-full"></ng-content>
    </div>
  `
})
export class FlexCardComponent {
  @Input() heading?: string;
  @Input() subheading?: string;
  @Input() headingAlign?: HeadingAlign;
  @Input() replaceClass: string = 'p-4 bg-base-100 rounded-lg shadow-lg overflow-hidden';
  @Input() addClass?: string;

  get getTextAlign(): string {
    return HeadingAlign[this.headingAlign || 'LEFT'];
  }
}

const HeadingAlign = {
  'LEFT': 'text-left',
  'CENTER': 'text-center',
  'RIGHT': 'text-right',
}
export type HeadingAlign = keyof typeof HeadingAlign;
