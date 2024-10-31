import {Component, inject, Input, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Setting_TTLService} from "../../../../../services/setting_ttl.service";

@Component({
  selector: 'app-edit-ttl-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40">

      <div [formGroup]="this.ttlForm" class="flex flex-col min-h-24 items-center justify-center bg-gray-800 w-1/3 rounded-t-lg">
        <h2 class="text-lg font-semibold text-white mb-4 ">Edit TTL for {{this.ttl().document_type_name}}</h2>
        <div class="flex  justify-center items-center">
          <form [formGroup]="ttlForm" class="flex flex-col mt-4 items-center">
            <div class="flex flex-col space-y-2 mb-2 -mt-4">
              <div class="flex items-center">
                <label for="year" class="text-white w-20">Years:</label>
                <input type="number" max="10" min="0" formControlName="year" class="flex-1 p-1 shadow border ml-2 border-gray-300 max-w-20 rounded mr-2" (keydown)="preventInput($event)" step="1">
              </div>

              <div class="flex items-center">
                <label for="month" class="text-white w-20">Months:</label>
                <input type="number" max="11" min="0" formControlName="month" class="flex-1 p-1 shadow border ml-2 border-gray-300 max-w-20 rounded mr-2" (keydown)="preventInput($event)" step="1">
              </div>

              <div class="flex items-center">
                <label for="day" class="text-white w-20">Days:</label>
                <input type="number" max="30" min="0" formControlName="day" class="flex-1 p-1 shadow border ml-2 border-gray-300 max-w-20 rounded mr-2" (keydown)="preventInput($event)" step="1">
              </div>
            </div>

          </form>
        </div>
      </div>
      <div class="flex justify-center bg-gray-700 w-1/3 rounded-b-lg">
        <div class="flex justify-center mt-4 mb-4">
          <button (click)="editTtl()" class="btn-gray-custom" >Edit
          </button>
          <button class="btn-gray-custom ml-4" (click)="toggleShowEditTtl(); $event.stopPropagation()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `
})
export class EditTtlModalComponent {
  @Input() toggleShowEditTtl!: Function;
  @Input() ttl!: WritableSignal<any>
  @Input() loadTtls!: Function
  setting_ttlService = inject(Setting_TTLService)
  ttlForm= new FormGroup({
    year: new FormControl(''),
    month: new FormControl(''),
    day: new FormControl('')
  })

  ngOnInit() {
    this.loadTtl()
    console.log(this.ttl())
  }

  loadTtl() {
    this.ttlForm.get('year')?.setValue(this.ttl()?.interval.years);
    this.ttlForm.get('month')?.setValue(this.ttl()?.interval.months);
    this.ttlForm.get('day')?.setValue(this.ttl()?.interval.days);
  }

  preventInput(event: KeyboardEvent) {
    event.preventDefault(); // Prevent all keyboard input except the spinner
  }

  editTtl() {
    let body = {
      "uuid": this.ttl()?.uuid,
      "organization_uuid": this.ttl()?.organization_uuid,
      "document_type_uuid": this.ttl()?.document_type_uuid,
      "interval": {
        "value": this.ttlForm.get('year')?.value + ' years ' + this.ttlForm.get('month')?.value + ' mons ' + this.ttlForm.get('day')?.value + ' days'
      }
    }
    this.setting_ttlService.createOrUpdateTTL(body).subscribe(() => {
      this.loadTtls()
      this.toggleShowEditTtl()
    })
  }
}
