import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {SettingService} from "../../../services/setting.service";
import {SessionStore} from "../../../stores/global/session.store";
import {SpinnerComponent} from "../../common/spinner.component";
import {NgClass} from "@angular/common";
import {SpecificTtlTableComponent} from "./specific-ttl-table/specific-ttl-table.component";

@Component({
  selector: 'app-time-to-live',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SpinnerComponent,
    NgClass,
    SpecificTtlTableComponent
  ],
  template: `
    <div class="">
    @if(isLoading()) {
      <div class="flex justify-center items-center mt-4">
        <app-spinner/>
      </div>
    }
    @else{

    <div class="mb-4 w-full">
      <form [formGroup]="TTLForm" class="flex mt-4 items-center">
        <label for="interval" class="text-gray-800 mr-2">Default: </label>
        <label for="year" class="text-gray-500 ">Years:</label>
        <input type="number" max="10" min="0" formControlName="year" class="flex flex-1 p-1 shadow border ml-2 border-gray-300 max-w-20 rounded mr-2" (keydown)="preventInput($event)" step="1">
        <label for="month" class=" text-gray-500 ">Months:</label>
        <input type="number" max="11" min="0" formControlName="month" class="flex flex-1 p-1 shadow border ml-2 max-w-20 border-gray-300 rounded mr-2" (keydown)="preventInput($event)" step="1">
        <label for="day" class=" text-gray-500 ">Days:</label>
        <input type="number" max="30" min="0" formControlName="day" class="flex flex-1 p-1 shadow border ml-2 border-gray-300 max-w-20 rounded mr-2" (keydown)="preventInput($event)" step="1">
        <div class="flex justify-center items-center ml-2">
          <button (click)="updateDefaultTTL()" class="btn-gray-custom btn-gray-small">Update</button>
        </div>
      </form>
    </div>

    <div class="flex items-center mt-4 cursor-pointer w-full"
         (click)="toggleShowTTLTable(); $event.stopPropagation()">
      <span class="text-lg font-semibold">Specific Document Types</span>
      <div class="flex-1 border-b-2 border-gray-300 ml-2 w-full"></div>
      <span [ngClass]="{'rotate-90': showTTLTable(), 'rotate-0': !showTTLTable()}" class="ml-2 transition-transform">
      &#9654; <!-- Right arrow -->
      </span>
    </div>
    @if (showTTLTable()) {
      <div>
        <app-specific-ttl-table></app-specific-ttl-table>
      </div>
    }
    }
    </div>

  `
})
export class TimeToLiveComponent {
  settingService = inject(SettingService)
  isLoading = signal(true)
  showTTLTable = signal(false)
  TTLForm = new FormGroup({
    year: new FormControl('1'),
    month: new FormControl(''),
    day: new FormControl('')
  });
  readonly organization = inject(SessionStore).userOrganization

  ngOnInit() {
    this.loadDefaultTTL();
  }
  updateDefaultTTL() {
    let body = {
      "organization_uuid": this.organization()!.uuid,
      "default_interval": {
        "value": this.TTLForm.get('year')?.value + ' years ' + this.TTLForm.get('month')?.value + ' mons ' + this.TTLForm.get('day')?.value + ' days'
      }
    }
    this.settingService.updateDefaultTTL(body).subscribe(() => {
      this.isLoading.set(true)
        this.loadDefaultTTL()
    })
  }
  loadDefaultTTL() {
    this.settingService.getSettingsByOrganizationUuid(this.organization()!.uuid).subscribe({
      next: (response: any) => {
        this.TTLForm.get('year')?.setValue(response.default_interval.years)
        this.TTLForm.get('month')?.setValue(response.default_interval.months)
        this.TTLForm.get('day')?.setValue(response.default_interval.days)
        setTimeout(() => {
          this.isLoading.set(false)
        }, 300)

      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  preventInput(event: KeyboardEvent) {
    event.preventDefault(); // Prevent all keyboard input except the spinner
  }

  toggleShowTTLTable() {
    this.showTTLTable.set(!this.showTTLTable())
  }
}
