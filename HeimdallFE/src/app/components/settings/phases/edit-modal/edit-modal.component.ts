import {Component, inject, Input, WritableSignal} from '@angular/core';
import {Phase} from "../../../../interfaces/phase";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {PhaseService} from "../../../../services/phase.service";

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40 ">
      <div [formGroup]="this.phaseForm" class="flex flex-col min-h-24 items-center justify-center bg-gray-800 w-5/12 rounded-t-lg max-w-[800px]">
        <h2 class="text-lg font-semibold text-white mb-4">Edit Phase</h2>

        <!-- Name Input -->
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
          <button (click)="editPhase()" class="btn-gray-custom">Edit</button>
          <button class="btn-gray-custom ml-4" (click)="toggleShowEditPhase(); $event.stopPropagation()">Cancel</button>
        </div>
      </div>
    </div>


  `
})
export class EditModalComponent {

  @Input() phase!: WritableSignal<Phase | null>;
  @Input() toggleShowEditPhase!: Function;
  phaseService = inject(PhaseService);
  phaseForm= new FormGroup({
    name: new FormControl(''),
    order_number: new FormControl('')
  })
  @Input() updatePhases!: Function;

  ngOnInit() {
    this.phaseForm.get('name')?.setValue(this.phase()?.name?.toString() || '');
    this.phaseForm.get('order_number')?.setValue(this.phase()?.order_number?.toString() || '');
  }

  editPhase() {
    this.phase()!.name = this.phaseForm.get('name')?.value!;
    this.phase()!.order_number = Number(this.phaseForm.get('order_number')?.value);
    this.phaseService.createOrUpdate(this.phase()!).subscribe(() => {
      this.updatePhases()
      this.toggleShowEditPhase()
    })
  }

  validateNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.phaseForm.get('order_number')?.setValue(input.value);
  }

}
