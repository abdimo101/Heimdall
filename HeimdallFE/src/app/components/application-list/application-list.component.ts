import {Component, effect, inject, ViewChild} from '@angular/core';
import {ColumnMode, DatatableComponent, NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ApplicationService} from "../../services/application.service";
import {ApplicationDetails} from "../../interfaces/ApplicationDetails";
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {UiStore} from "../../stores/global/ui.store";

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [
    NgxDatatableModule,
    ReactiveFormsModule
  ],
  template:`
    <div class=" pl-12 pr-12">
      <div class="flex justify-center">
        <h1 class="text-2xl font-bold mb-2">Applications</h1>
      </div>
      <div class="flex mb-4 mb-t-4 -ml-2">
        <div [formGroup]="filterForm" class="flex ">
          <select formControlName="filter" class="p-2 border ml-2 border-gray-300 rounded mr-2 shadow">
            <option disabled value="">Search for...</option>
            <option value="key" >Key</option>
            <option value="name" >Name</option>
            <option value="po" >Po</option>
            <option value="pm" >Pm</option>
            <option value="phase" >Phase</option>
            <option value="version" >Version</option>
          </select>
        </div>
        <div>
          <input class="flex shadow rounded-lg p-2 min-w-96"
                 type="text"
                 placeholder="Type to search for chosen field"
                 (keyup)="updateFilter($event)"
          />
        </div>
      </div>
      <ngx-datatable
        #table
        class="material"
        [columnMode]="ColumnMode.force"
        [headerHeight]="50"
        [footerHeight]="50"
        rowHeight="auto"
        [limit]="rowsPerPage"
        [rows]="rows"
        [sorts]="[{ prop: 'key', dir: 'asc' }]"
      >
        <ngx-datatable-column name="KEY" prop="key">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer "
                 (click)="navigateToApplication(row.application_uuid)">
              <span class="chip-content ">{{ row.key }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="NAME">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer "
                 (click)="navigateToApplication(row.application_uuid)">
              <span class="chip-content ">{{ row.name }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="PO" prop="po">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer " (click)="navigateToUser(row.po_id)">
              <span class="chip-content ">{{ row.po }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="PM" prop="pm">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer " (click)="navigateToUser(row.pm_id)">
              <span class="chip-content ">{{ row.pm }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="PHASE" prop="phase"></ngx-datatable-column>
        <ngx-datatable-column name="VERSION" prop="version"></ngx-datatable-column>
      </ngx-datatable>
    </div>
  `,
  styles: `
    .ngx-datatable {
      border-radius: 10px;

    }
    :host ::ng-deep.datatable-header
    {
      background: #111827;
      color: #fff;
      opacity: 0.9;
    }

    :host ::ng-deep ngx-datatable.fixed-header
    .datatable-header-inner
    .datatable-header-cell {
      background: #111827;
      color: #fff;
      opacity: 0.9;
      text-wrap: wrap !important;
      word-wrap: break-word !important;
    }
  `,
})
export class ApplicationListComponent {

  rows: any[] = [];
  temp: any[] = [];
  ColumnMode = ColumnMode;
  rowsPerPage = 8;
  filterForm = new FormGroup({
    filter: new FormControl('key')
  });

  @ViewChild(DatatableComponent) table: DatatableComponent | undefined;
  applicationService = inject(ApplicationService)
  applications = <ApplicationDetails[]>([]);
  router = inject(Router);
  sideBarOpen = inject(UiStore).sidebarOpen;

  constructor() {
    this.getApplications();
  }

  reloadTablesEffect = effect(() => {
    this.sideBarOpen()
    setTimeout(() => {
      this.table?.recalculate()
    },330)

  })

  getApplications() {
    this.applicationService.getApplicationsWithUserDetails().subscribe({
      next: (response) => {
        this.applications = response;
        this.getApplicationsMapListObject()
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  navigateToApplication(uuid: String) {
    this.router.navigate(['/org/application/' + uuid]);
  }
  navigateToUser(id: String) {
    this.router.navigate(['/org/user/' + id]);
  }

  getApplicationsMapListObject() {
    this.rows = this.applications.map(app => ({
      key: app.app_key,
      application_uuid: app.uuid,
      name: app.name,
      po: app.po_name || 'N/A',
      po_id: app.po_id,
      pm: app.pm_name || '',
      pm_id: app.pm_id,
      phase: app.phase_name || '',
      version: app.version || ''
    }));
    this.temp = [...this.rows];
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    let templocal: any[] = [];
    switch (this.filterForm.value.filter) {
      case 'key':
        templocal = this.temp.filter(function (d) {
          return d.key.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'name':
        templocal = this.temp.filter(function (d) {
          return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'po':
        templocal = this.temp.filter(function (d) {
          return d.po.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'pm':
        templocal = this.temp.filter(function (d) {
          return d.pm.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'phase':
        templocal = this.temp.filter(function (d) {
          return d.phase.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'version':
        templocal = this.temp.filter(function (d) {
          return d.version.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
    }

    // update the rows
    this.rows = templocal;
    // Whenever the filter changes, always go back to the first page
    this.table!.offset = 0;
  }

}
