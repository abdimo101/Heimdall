import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NgStyle
  ],
  template: `
      <div class="inline-block spinner" [ngStyle]="{
      'width.rem': this.size,
      'height.rem': this.size,
      'border-color': this.bgColor,
      'border-top-color': this.color,
      'border-width.rem': this.size / 6,
      }"></div>
  `,
  styles: `
    .spinner {
      border-radius: 50%;
      animation: spin 1500ms linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `
})
export class SpinnerComponent {
  @Input() size: number = 2;
  @Input() color: string = 'rgba(0, 0, 0, 0.3)';
  @Input() bgColor: string = 'rgba(0, 0, 0, 0.1)';
}
