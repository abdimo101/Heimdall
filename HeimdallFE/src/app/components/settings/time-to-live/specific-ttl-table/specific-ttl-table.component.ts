import {Component, inject, signal, ViewChild, WritableSignal} from '@angular/core';
import {ColumnMode, DatatableComponent, NgxDatatableModule} from "@swimlane/ngx-datatable";
import {Setting_TTLService} from "../../../../services/setting_ttl.service";
import {SessionStore} from "../../../../stores/global/session.store";
import {SpinnerComponent} from "../../../common/spinner.component";
import {EditTtlModalComponent} from "./edit-ttl-modal/edit-ttl-modal.component";
import {FormControl, FormGroup} from "@angular/forms";
import {CreateTtlModalComponent} from "./create-ttl-modal/create-ttl-modal.component";

@Component({
  selector: 'app-specific-ttl-table',
  standalone: true,
  imports: [
    NgxDatatableModule,
    SpinnerComponent,
    EditTtlModalComponent,
    CreateTtlModalComponent
  ],
  template: `
    @if(isLoading()) {
      <div class="flex justify-center items-center mt-4">
        <app-spinner/>
      </div>
    }
    @else{
    <div class="w-full">
      <div class="mb-2 mt-2">
      <input class="flex rounded-lg shadow p-2 min-w-96"
             type="text"
             placeholder="Type to search for chosen field"
             (keyup)="updateTtlFilter($event)"
      />
    </div>
      <ngx-datatable
        #table
        class="material"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        [footerHeight]="50"
        rowHeight="auto"
        [limit]="6"
        [rows]="rows"
      >
        <ngx-datatable-column name="Document Type" prop="name">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500">
              <span class="chip-content ">{{ row.name }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Years" prop="years">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500">
              <span class="chip-content ">{{ row.years }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Months" prop="months">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500">
              <span class="chip-content ">{{ row.months }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="days" prop="days">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500">
              <span class="chip-content ">{{ row.days }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="" [sortable]="false">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer ">
              <button (click)="toggleShowEditTtl(row.ttl)" class="ml-4 text-red-600 hover:text-red-800 flex-none">
                Edit
              </button>
              <button (click)="toggleDeleteTtl(row.ttl)"  class="ml-4 text-red-600 hover:text-red-800 flex-none">
                Delete
              </button>
            </div>
          </ng-template>
        </ngx-datatable-column>

      </ngx-datatable>
      <div class="flex justify-center">
        <button (click)="toggleShowCreateTtl()" class="btn-gray-custom mt-4">Create TTL</button>
      </div>
    </div>
    }
    @if(showEditTtl()) {
      <app-edit-ttl-modal
        [toggleShowEditTtl]="toggleShowEditTtl.bind(this)"
        [ttl]="workingTtl"
        [loadTtls]="loadTTLs.bind(this)"
      ></app-edit-ttl-modal>
    }
    @if (showCreateTtl()) {
      <app-create-ttl-modal
        [toggleCreateTtl]="toggleShowCreateTtl.bind(this)"
        [loadTtls]="loadTTLs.bind(this)"
      ></app-create-ttl-modal>
    }
    @if(deleteTtl())
    {
      <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40">

        <div class="flex flex-col min-h-24 items-center justify-center bg-gray-800 w-1/3 rounded-t-lg">
          <h2 class="text-white text-xl p-4">Are you sure you want to delete: {{workingTtl().document_type_name}}?</h2>
        </div>
        <div class="flex justify-center bg-gray-700 w-1/3 rounded-b-lg">
          <div class="flex justify-center mt-4 mb-4">
            <button (click)="deleteSpecificTTL()" class="btn-gray-custom">Delete
            </button>
            <button class="btn-gray-custom ml-4" (click)="toggleDeleteTtl(); $event.stopPropagation()">
              Cancel
            </button>
          </div>
        </div>
      </div>
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
export class SpecificTtlTableComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent | undefined;
  rows: any[] = [];
  temp: any[] = [];
  workingTtl: WritableSignal<any | null> = signal(null);
  showEditTtl = signal(false);
  isLoading = signal(true);
  showCreateTtl = signal(false);
  deleteTtl = signal(false)
  ttls: WritableSignal<any | null> = signal(null);
  setting_ttlService = inject(Setting_TTLService);
  readonly organization = inject(SessionStore).userOrganization
  filterForm = new FormGroup({
    filter: new FormControl('document_type'),
  })
  ngOnInit() {
    this.loadTTLs();
  }

  toggleShowCreateTtl() {
    this.showCreateTtl.set(!this.showCreateTtl());
  }
  toggleShowEditTtl(ttl?: any) {
    if(!!ttl) {
      this.workingTtl.set(ttl)
      this.showEditTtl.set(!this.showEditTtl());
    }
    else{
      this.workingTtl.set(null)
      this.showEditTtl.set(!this.showEditTtl());
    }
  }

  loadTTLs() {
    this.setting_ttlService.findAllByOrganizationUuid(this.organization()!.uuid).subscribe((response) => {
      this.ttls.set(response)
      this.getTtlsMapListObject()
      setTimeout(() => {
        this.isLoading.set(false)
      }, 300)
    })
  }

  getTtlsMapListObject() {
    this.rows = this.ttls()!.map((ttl: any) => ({
      name: ttl.document_type_name,
      years: ttl.interval.years,
      months: ttl.interval.months,
      days: ttl.interval.days,
      ttl: ttl

    }));
    this.temp = [...this.rows];
  }

  toggleDeleteTtl(ttl?: any) {
    if (!!ttl) {
      this.deleteTtl.set(!this.deleteTtl())
      this.workingTtl.set(ttl)
    } else{
      this.deleteTtl.set(!this.deleteTtl())
      this.workingTtl.set(null)
    }

  }

  updateTtlFilter(event: any) {
    const val = event.target.value.toLowerCase();
    let templocal: any[] = [];
    switch (this.filterForm.value.filter) {
      case 'document_type':
        templocal = this.temp.filter(function (d) {
          return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
    }
    // update the rows
    this.rows = templocal;
    // Whenever the filter changes, always go back to the first page
    this.table!.offset = 0;
  }

  deleteSpecificTTL() {
    this.setting_ttlService.deleteTTL(this.workingTtl().uuid).subscribe(() => {
      this.loadTTLs()
      this.toggleDeleteTtl()
    })
  }
  protected readonly ColumnMode = ColumnMode;
}
