import {Component, inject, Input, WritableSignal} from '@angular/core';
import {Phase} from "../../../../interfaces/phase";
import {PhaseService} from "../../../../services/phase.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';
import {SessionStore} from "../../../../stores/global/session.store";

@Component({
  selector: 'app-create-phase-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40">

      <div [formGroup]="this.phaseForm" class="flex flex-col min-h-24 items-center justify-center bg-gray-800 w-5/12 rounded-t-lg max-w-[800px]">
        <h2 class="text-lg font-semibold text-white mb-4 ">Create Phase</h2>
        <div class="flex items-center justify-center w-8/12 mb-2">
          <label class="text-white w-32 text-right mr-2">Name:</label>
          <input formControlName="name" class="flex  rounded-lg shadow p-1 border border-gray-300">
        </div>

        <!-- Order Number Input -->
        <div class="flex items-center justify-center w-8/12 mb-2">
          <label class="text-white w-32 text-right mr-2">Order Number:</label>
          <input type="number" formControlName="order_number" class=" rounded-lg shadow p-1 border border-gray-300" (input)="validateNumberInput($event)">
        </div>
      </div>
      <div class="flex justify-center bg-gray-700 w-5/12 rounded-b-lg max-w-[800px]">
        <div class="flex justify-center mt-4 mb-4">
          <button (click)="createPhase()" class="btn-gray-custom" >Create
          </button>
          <button class="btn-gray-custom ml-4" (click)="toggleCreatePhase(); $event.stopPropagation()">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `
})
export class CreatePhaseModalComponent {
  @Input() phase!: WritableSignal<Phase | null>;
  @Input() toggleCreatePhase!: Function;
  phaseService = inject(PhaseService);
  readonly organization = inject(SessionStore).userOrganization
  newUuid = ''
  phaseForm= new FormGroup({
    name: new FormControl(''),
    order_number: new FormControl('')
  })
  @Input() updatePhases!: Function;

  ngOnInit() {
    console.log(this.phase())
    this.newUuid = uuidv4();
  }

  createPhase() {
    this.phase.set({
      uuid: this.newUuid,
      name: this.phaseForm.get('name')?.value!,
      order_number: this.phaseForm.get('order_number')?.value || undefined,
      organization_uuid: this.organization()!.uuid
    } as Phase);
    console.log(this.phase())
    this.phaseService.createOrUpdate(this.phase()!).subscribe(() => {
      this.updatePhases()
      this.toggleCreatePhase()
    })
  }
  validateNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.phaseForm.get('order_number')?.setValue(input.value);
  }
}
