import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-popup-notice',
  standalone: true,
  imports: [],
  template: `
    @if(show)
    {
      <div class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-gray-900 text-white p-6 rounded-lg shadow-lg border border-gray-700 max-w-lg w-full h-48 flex flex-col justify-center">
          <div class="flex flex-col justify-center items-center h-full">
            <span class="text-xl">{{ message }}</span>
            <button class="mt-4 text-white" (click)="close()">✕</button>
          </div>
        </div>
      </div>
    }

  `,
})
export class PopupNoticeComponent {
  @Input() message: string = 'Operation successful!';
  show: boolean = false;

  display(message: string) {
    this.message = message;
    this.show = true;

    setTimeout(() => this.close(), 30000); // Auto-hide after 30 seconds
  }

  close() {
    this.show = false;
  }
}

