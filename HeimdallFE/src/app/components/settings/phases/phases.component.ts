import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {ColumnMode, NgxDatatableModule} from "@swimlane/ngx-datatable";
import {Phase} from "../../../interfaces/phase";
import {PhaseService} from "../../../services/phase.service";
import {PopupNoticeComponent} from "../../popup-notice/popup-notice.component";
import {CreatePhaseModalComponent} from "./create-phase-modal/create-phase-modal.component";
import {EditModalComponent} from "./edit-modal/edit-modal.component";
import {SpinnerComponent} from "../../common/spinner.component";
import {PhaseStore} from "../../../stores/phase.store";

@Component({
  selector: 'app-phases',
  standalone: true,
  imports: [
    NgxDatatableModule,
    PopupNoticeComponent,
    CreatePhaseModalComponent,
    EditModalComponent,
    SpinnerComponent
  ],
  template: `
    @if (isLoading()) {
      <div class="flex justify-center items-center mt-4">
        <app-spinner/>
      </div>
    } @else {
      <div class="w-full">
        <ngx-datatable
          #table
          class="material"
          [columnMode]="ColumnMode.force"
          [headerHeight]="50"
          [footerHeight]="50"
          rowHeight="auto"
          [limit]="6"
          [rows]="rows"
          [sorts]="[{ prop: 'order_number', dir: 'asc' }]"
        >
          <ngx-datatable-column name="Phase" prop="name">
            <ng-template ngx-datatable-cell-template let-row="row">
              <div class="text-gray-500">
                <span class="chip-content ">{{ row.name }}</span>
              </div>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Order Number" prop="order_number">
            <ng-template ngx-datatable-cell-template let-row="row">
              <div class="text-gray-500">
                <span class="chip-content ">{{ row.order_number }}</span>
              </div>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="" [sortable]="false">
            <ng-template ngx-datatable-cell-template let-row="row">
              <div class="text-gray-500 hover:text-gray-800 cursor-pointer ">
                <button (click)="toggleShowEditPhase(row.phase)" class="ml-4 text-red-600 hover:text-red-800 flex-none">
                  Edit
                </button>
                <button (click)="toggleShowDeletePhase(row.phase)"
                        class="ml-4 text-red-600 hover:text-red-800 flex-none">
                  Delete
                </button>
              </div>
            </ng-template>
          </ngx-datatable-column>

        </ngx-datatable>
        <div class="flex justify-center">
          <button (click)="toggleShowCreatePhase()" class="btn-gray-custom mt-4">Create Phase</button>
        </div>
      </div>

      @if (showEditPhase()) {
        <app-edit-modal
          [phase]="workingPhase"
          [toggleShowEditPhase]="toggleShowEditPhase.bind(this)"
          [updatePhases]="updatePhases.bind(this)"
        ></app-edit-modal>
      }
      @if (showCreatePhase()) {
        <app-create-phase-modal
          [phase]="workingPhase"
          [toggleCreatePhase]="toggleShowCreatePhase.bind(this)"
          [updatePhases]="updatePhases.bind(this)"
        ></app-create-phase-modal>
      }

      @if (showDeletePhase()) {
        <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40">

          <div class="flex flex-col min-h-24 items-center justify-center bg-gray-800 w-1/3 rounded-t-lg">
            <h2 class="text-white text-xl p-4">Are you sure you want to delete? {{ workingPhase()?.name }}</h2>
          </div>
          <div class="flex justify-center bg-gray-700 w-1/3 rounded-b-lg">
            <div class="flex justify-center mt-4 mb-4">
              <button (click)="deletePhase()" class="btn-gray-custom">Delete
              </button>
              <button class="btn-gray-custom ml-4" (click)="toggleShowDeletePhase(); $event.stopPropagation()">
                Cancel
              </button>
            </div>
          </div>
        </div>

      }

      <app-popup-notice></app-popup-notice>
    }
  `,
  styles: `
    .ngx-datatable {
      border-radius: 10px;
      box-shadow: none !important;
      background: #e5e7eb;

    }

    :host ::ng-deep ngx-datatable.fixed-header
    .datatable-header
    .datatable-header-inner
    .datatable-header-cell {
      background: #e5e7eb;
      color: #000000;
      opacity: 0.9;
      text-wrap: wrap !important;
      word-wrap: break-word !important;
    }`
})
export class PhasesComponent {
  isLoading = signal(true)
  @ViewChild(PopupNoticeComponent) notification!: PopupNoticeComponent;
  rows: any[] = []
  temp: any[] = []
  phaseStore = inject(PhaseStore)
  phaseService = inject(PhaseService)
  workingPhase: WritableSignal<Phase | null> = signal(null)
  showDeletePhase = signal(false)
  showEditPhase = signal(false);
  showCreatePhase = signal(false);
  phases: WritableSignal<Phase[] | null> = signal(null)

  ngOnInit() {
    this.updatePhases();
  }
  toggleShowDeletePhase(phase?: Phase) {
    if(!!phase) {
      this.workingPhase.set(phase)
      this.showDeletePhase.set(!this.showDeletePhase())
    }
    else{
      this.workingPhase.set(null)
      this.showDeletePhase.set(!this.showDeletePhase())
    }
  }
  toggleShowEditPhase(phase?: Phase) {
    if(!!phase) {
      this.workingPhase.set(phase)
      this.showEditPhase.set(!this.showEditPhase())
    }
    else{
      this.workingPhase.set(null)
      this.showEditPhase.set(!this.showEditPhase())
    }
  }
  toggleShowCreatePhase(phase?: Phase) {
    if(!!phase) {
      this.workingPhase.set(phase)
      this.showCreatePhase.set(!this.showCreatePhase())
    }
    else{
      this.workingPhase.set(null)
      this.showCreatePhase.set(!this.showCreatePhase())
    }
  }
  getPhasesMapListObject() {
    this.rows = this.phases()!.map(phase => ({
      name: phase.name,
      uuid: phase.uuid,
      order_number: phase.order_number,
      phase: phase,
    }));
    this.temp = [...this.rows];
  }

  deletePhase() {
    this.phaseService.deletePhase(this.workingPhase()!.uuid!.toString()).subscribe({
      next: () => {
        this.updatePhases();
        this.toggleShowDeletePhase();
      },
      error: (err) => {
        this.notification.display('Unable to delete: Phase still in use');
        // Handle the error appropriately, e.g., show a notification to the user
      }
    });
  }
  updatePhases()
  {
    this.phaseService.getAllPhases().subscribe((phases: Phase[]) => {
      this.phases.set(phases)
      this.getPhasesMapListObject()
      this.phaseStore.fetchPhases()
      setTimeout(() => {
        this.isLoading.set(false)
      }, 300)
    })
  }

  protected readonly ColumnMode = ColumnMode;
}
