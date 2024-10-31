import {Component, signal} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import { NgxDatatableModule} from "@swimlane/ngx-datatable";
import {EditModalComponent} from "./phases/edit-modal/edit-modal.component";
import {CreatePhaseModalComponent} from "./phases/create-phase-modal/create-phase-modal.component";
import {PopupNoticeComponent} from "../popup-notice/popup-notice.component";
import {ReactiveFormsModule} from "@angular/forms";
import {TimeToLiveComponent} from "./time-to-live/time-to-live.component";
import {PhasesComponent} from "./phases/phases.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NgClass,
    NgxDatatableModule,
    EditModalComponent,
    CreatePhaseModalComponent,
    PopupNoticeComponent,
    ReactiveFormsModule,
    NgForOf,
    TimeToLiveComponent,
    PhasesComponent
  ],
  template: `
    <div class="flex flex-col items-center w-full">
      <div class="w-6/12 flex flex-col items-center">
        <div>
          <h1 class="text-4xl font-bold text-gray-800">Settings</h1>
        </div>

        <div class="flex items-center mt-4 cursor-pointer w-full"
             (click)="toggleShowPhases(); $event.stopPropagation()">
          <span class="text-lg font-semibold">Phases</span>
          <div class="flex-1 border-b-2 border-gray-300 ml-2 w-full"></div>
          <span [ngClass]="{'rotate-90': showPhases(), 'rotate-0': !showPhases()}" class="ml-2 transition-transform">
      &#9654; <!-- Right arrow -->
      </span>
        </div>
        <div class="flex ml-2 items-start w-full">
          @if (showPhases()) {
            <div class="w-full">
                <app-phases></app-phases>
            </div>
          }
        </div>
        <div class="flex items-center mt-4 cursor-pointer w-full"
             (click)="toggleShowTTL(); $event.stopPropagation()">
          <span class="text-lg font-semibold">Time To Live</span>
          <div class="flex-1 border-b-2 border-gray-300 ml-2 w-full"></div>
          <span [ngClass]="{'rotate-90': showTTL(), 'rotate-0': !showTTL()}" class="ml-2 transition-transform">
      &#9654; <!-- Right arrow -->
      </span>
        </div>
        @if (showTTL()) {
          <div class="w-11/12">
        <app-time-to-live></app-time-to-live>
          </div>
        }
      </div>
    </div>

  `
})
export class SettingsComponent {

  showPhases = signal(false)

  showTTL = signal(false)

  toggleShowPhases() {
    this.showPhases.set(!this.showPhases())
  }


  toggleShowTTL() {
    this.showTTL.set(!this.showTTL())
  }
}

