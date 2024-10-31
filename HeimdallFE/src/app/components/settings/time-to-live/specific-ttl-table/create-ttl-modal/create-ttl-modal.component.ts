import {Component, inject, Input, signal, WritableSignal} from '@angular/core';
import {Setting_TTLService} from "../../../../../services/setting_ttl.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Document_typePickerComponent} from "../../../../team/requirement/document_type-picker/document_type-picker.component";
import {v4 as uuidv4} from 'uuid';
import {Document_type} from "../../../../../interfaces/document_type";
import {SessionStore} from "../../../../../stores/global/session.store";

@Component({
  selector: 'app-create-ttl-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Document_typePickerComponent
  ],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40">
      <div [formGroup]="this.ttlForm" class="bg-gray-800 w-1/3 rounded-lg shadow-lg">

        <!-- Modal Header -->
        <div class="flex justify-center items-center bg-gray-900 rounded-t-lg p-4">
          <h2 class="text-lg font-semibold text-white">Create new TTL</h2>
        </div>

        <!-- Modal Body -->
        <div class="p-6">

          <!-- Document Type Field -->
          <div [formGroup]="documentTypeForm" class="flex flex-col mb-6 mx-auto w-fit">
            <div class="flex items-center">
              <label for="document_type" class="text-white mr-2 w-32 whitespace-nowrap">Document type:</label>
              <div class="w-full">
                @if (showDocument_typePicker()) {
                  <app-document_type-picker (showSignal)="showDocument_typePicker.set($event)"
                                            (document_typeEmitter)="handleDocument_typePicked($event)">
                  </app-document_type-picker>
                } @else {
                  <input type="text" readonly (click)="pickDocument_type()"
                         [value]="this.documentTypeForm.get('document_type')?.value?.uuid ? this.documentTypeForm.get('document_type')?.value?.name : ''"
                         placeholder="Search for Document type" id="document_type_existing"
                         class="pl-1 ml-[2px] h-[28px] rounded w-full flex-1 "/>
                }
              </div>
            </div>
          </div>

          <!-- Time Fields (Year, Month, Day) -->
          <form [formGroup]="ttlForm" class="flex flex-col items-center space-y-4 mx-auto w-fit">
            <div class="flex items-center">
              <label for="year" class="text-white w-32">Years:</label>
              <input type="number" max="10" min="0" formControlName="year"
                     class="w-32 p-2 shadow-sm border border-gray-300 rounded" (keydown)="preventInput($event)" step="1">
            </div>
            <div class="flex items-center">
              <label for="month" class="text-white w-32">Months:</label>
              <input type="number" max="11" min="0" formControlName="month"
                     class="w-32 p-2 shadow-sm border border-gray-300 rounded" (keydown)="preventInput($event)" step="1">
            </div>
            <div class="flex items-center">
              <label for="day" class="text-white w-32">Days:</label>
              <input type="number" max="30" min="0" formControlName="day"
                     class="w-32 p-2 shadow-sm border border-gray-300 rounded" (keydown)="preventInput($event)" step="1">
            </div>
          </form>

        </div>

        <!-- Modal Footer -->
        <div class="flex justify-center bg-gray-700 rounded-b-lg p-4">
          <button class="btn-gray-custom" [disabled]="!documentTypeForm.valid" (click)="createTtl()">Create</button>
          <button class="btn-gray-custom ml-4" (click)="toggleCreateTtl(); $event.stopPropagation()">Cancel</button>
        </div>

      </div>
    </div>

  `
})
export class CreateTtlModalComponent {
  @Input() toggleCreateTtl!: Function;
  @Input() loadTtls!: Function
  uuid = ''
  showDocument_typePicker = signal(false);
  readonly organization = inject(SessionStore).userOrganization
  documentTypeForm = new FormGroup({
    document_type: new FormControl(null as Document_type | null, Validators.required),
  });
  setting_ttlService = inject(Setting_TTLService)
  ttlForm= new FormGroup({
    year: new FormControl(''),
    month: new FormControl(''),
    day: new FormControl('')
  })
  ngOnInit() {
    this.uuid = uuidv4();
  }

  preventInput(event: KeyboardEvent) {
    event.preventDefault(); // Prevent all keyboard input except the spinner
  }
  pickDocument_type() {
    this.showDocument_typePicker.set(true);
  }
  handleDocument_typePicked(document_type: Document_type) {
    this.documentTypeForm.get("document_type")?.setValue(document_type);
  }
  createTtl() {
    let body = {
      document_type_uuid: this.documentTypeForm.get('document_type')!.value!.uuid,
      organization_uuid: this.organization()!.uuid,
      uuid: this.uuid,
      interval: {
        years: this.ttlForm.get('year')?.value,
        months: this.ttlForm.get('month')?.value,
        days: this.ttlForm.get('day')?.value
      }
    }
    this.setting_ttlService.createOrUpdateTTL(body).subscribe(() => {
      this.loadTtls()
      this.toggleCreateTtl()
    })
  }
}
