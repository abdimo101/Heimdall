import {Component, effect, inject, Input, signal, ViewChild, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ColumnMode, DatatableComponent, NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ApplicationDetails} from "../../../interfaces/ApplicationDetails";
import {Document} from "../../../interfaces/document";
import {Router} from "@angular/router";
import {NgOptimizedImage, DatePipe} from "@angular/common";
import {MissingApprovalsModalComponent} from "../missing-approvals-modal/missing-approvals-modal.component";
import {v4 as uuidv4} from "uuid";

import {CreateNewModalComponent} from "./create-new-modal/create-new-modal.component";
import {DocumentService} from "../../../services/document.service";
import {ApplicationService} from "../../../services/application.service";
import {Setting_TTLService} from "../../../services/setting_ttl.service";
import { TTLDisplay } from '../../../interfaces/TTLDisplay';
import {UiStore} from "../../../stores/global/ui.store";

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MissingApprovalsModalComponent,
    CreateNewModalComponent,
    DatePipe
  ],
  template: `
    <div class="flex mb-4 mt-4 ml-4">
      <div [formGroup]="this.filterForm" class="flex">
        <select formControlName="filter" class="p-2 shadow border ml-2 border-gray-300 rounded mr-2">
          <option value="document_type" >Document Type</option>
          <option value="link" >Link</option>
          <option value="ttl" >TTL</option>
        </select>
      </div>
      <div>
        <input class="flex rounded-lg shadow p-2 min-w-96 bg-gray-200 border border-gray-300"
               type="text"
               placeholder="Type to search for chosen field"
               (keyup)="this.updateDocumentFilter($event)"
        />

      </div>
      <div>
        <span class="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer text-xs leading-6"
              (click)="toggleShowCreateNewDocumentModal(); $event.stopPropagation()">Create new Document</span>
      </div>
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
      <ngx-datatable-column name="Document Type" prop="document_type">
        <ng-template ngx-datatable-cell-template let-row="row">
          <div class="text-gray-500 hover:text-gray-800 cursor-pointer " (click)="navigateToDocument(row.full_doc); $event.stopPropagation()">
            <span class="chip-content ">{{ row.document_type }}</span>
          </div>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Link" prop="link">
        <ng-template ngx-datatable-cell-template let-row="row">
          <div class="text-gray-500 hover:text-gray-800 cursor-pointer ">
            <span class="chip-content " (click)="navigateToDocumentLink(row.link)">{{ row.link }}</span>
          </div>
        </ng-template>
      </ngx-datatable-column>

      <ngx-datatable-column name="TTL" prop="ttl">
        <ng-template ngx-datatable-cell-template let-row="row">
          <div class="text-gray-500 hover:text-gray-800 cursor-pointer " (click)="navigateToDocument(row.full_doc); $event.stopPropagation()">
            <span class="chip-content ">{{ row.ttl }}</span>
          </div>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="Approved by all?" prop="approved_by_all" >
        <ng-template ngx-datatable-cell-template let-row="row">
          <div class="text-gray-500 hover:text-gray-800 cursor-pointer" >
            <span class="chip-content " (click)="navigateToDocument(row.full_doc); $event.stopPropagation()">{{ row.approved_by_all }}</span>
            @if (checkApprovedByAll(row.full_doc) === 'No') {
              <span class="" title="Some approvals are missing click to find out more" (click)="toggleMissingApprovals(row.full_doc)">
                                  <img [ngSrc]="eyes" alt="Eyes Icon" class="inline-block w-4 h-4 mb-0.5 hover:fill-gray-800" width="633" height="475">
                          </span>
            }
          </div>
        </ng-template>
      </ngx-datatable-column>
      <ngx-datatable-column name="" [sortable]="false">
        <ng-template ngx-datatable-cell-template let-row="row">
          <div class="text-gray-500 hover:text-gray-800 cursor-pointer ">
            <button class="ml-4 text-red-600 hover:text-red-800 flex-none" (click)="toggleDeleteDocument(row.uuid)">
              Delete
            </button>
          </div>
        </ng-template>
      </ngx-datatable-column>

    </ngx-datatable>

    @if(showMissingApprovals())
    {
      <app-missing-approvals-modal
        [toggleMissingApprovalsModal]="toggleMissingApprovals.bind(this)"
        [document]="this.missingApprovalsDocument"
      ></app-missing-approvals-modal>
    }
    @if(showCreateNewDocumentModal())
    {
      <app-create-new-modal
        [application]="this.application"
        [documentUuid]="this.documentUuid"
        [toggleShowCreateNewDocumentModal]="toggleShowCreateNewDocumentModal.bind(this)"
        [getDocumentsMapListObject]="this.getDocumentsMapListObject.bind(this)"
      ></app-create-new-modal>
    }
    @if(showDeleteDocument())
    {
      <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40">

        <div class="flex flex-col min-h-24 items-center justify-center bg-gray-800 w-1/3 rounded-t-lg">
          <h2 class="text-white text-xl p-4">Are you sure you want to delete?</h2>
        </div>
        <div class="flex justify-center bg-gray-700 w-1/3 rounded-b-lg">
          <div class="flex justify-center mt-4 mb-4">
            <button class="btn-gray-custom" (click)="deleteDocument(this.workingDocumentUuid()); $event.stopPropagation()">Delete
            </button>
            <button class="btn-gray-custom ml-4" (click)="toggleDeleteDocument(); $event.stopPropagation()">
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

    }

    :host ::ng-deep ngx-datatable.fixed-header
    .datatable-header
    .datatable-header-inner
    .datatable-header-cell {
      background: #ffffff;
      color: #000000;
      opacity: 0.9;
      text-wrap: wrap !important;
      word-wrap: break-word !important;
    }
  `,
})
export class DocumentsComponent {
  constructor(private router: Router) {
  }
  @ViewChild(DatatableComponent) table: DatatableComponent | undefined;
  rows: any[] = [];
  temp: any[] = [];
  @Input() application!: WritableSignal<ApplicationDetails | undefined>;
  missingApprovalsDocument: WritableSignal<any | null> = signal(null);
  showMissingApprovals = signal(false);
  showCreateNewDocumentModal = signal(false);
  showDeleteDocument = signal(false)
  workingDocumentUuid = signal('');
  documentService = inject(DocumentService)
  applicationService = inject(ApplicationService)
  documentUuid: string = '';
  eyes = 'assets/info.svg';
  filterForm = new FormGroup({
    filter: new FormControl ('document_type')
  })
  setting_ttlService = inject(Setting_TTLService);
  ttl: TTLDisplay | undefined = undefined;
  sideBarOpen = inject(UiStore).sidebarOpen;


  ngOnInit() {
    this.getDocumentsMapListObject();
  }

  reloadTablesEffect = effect(() => {
    this.sideBarOpen()
    setTimeout(() => {
      this.table?.recalculate()
    }, 330)
  })

  getDocumentsMapListObject() {
    if(this.application()!.documents){
      this.loadDocumentsTTL(this.application()!.documents!);
    }
    setTimeout(() => {
    this.rows = this.application()!.documents!.map(doc => ({
      document_type: doc.type_name,
      link: doc.link,
      full_doc: doc,
      ttl: doc.ttl ? new Date(doc.ttl).toLocaleString('en-DK', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })
    : 'Document is not approved',
      approved_by_all: this.checkApprovedByAll(doc),
      uuid: doc.uuid
    }));
    this.temp = [...this.rows];
    }, 300);
  }

  updateDocumentFilter(event: any) {
    const val = event.target.value.toLowerCase();
    let templocal: any[] = [];
    switch (this.filterForm.value.filter) {
      case 'document_type':
        templocal = this.temp.filter(function (d) {
          return d.document_type.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'link':
        templocal = this.temp.filter(function (d) {
          return d.link.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'ttl':
        templocal = this.temp.filter(function (d) {
          return d.ttl.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
    }
    this.rows = templocal;
    // Whenever the filter changes, always go back to the first page
    this.table!.offset = 0;

  }

  checkApprovedByAll(document: Document): String {
    if (document?.approvals?.length === 0) return 'Document has no approvals';
    if(document.approvals?.every(approval => approval.status === 'approved'))
    {
      return 'Yes';
    }
    else
    {
      return 'No';
    }
  }

  navigateToDocument(document: Document)
  {
    this.router.navigate(['/org/application/' + this.application()!.uuid + '/' + document.document_type_uuid + '/' + document.uuid]);
  }

  toggleMissingApprovals(document: Document) {
    this.showMissingApprovals.set(!this.showMissingApprovals());
    if(!!document) {
      this.missingApprovalsDocument.set(document);
    }
    else {
      this.missingApprovalsDocument.set(null);
    }
  }


  toggleShowCreateNewDocumentModal() {
    this.showCreateNewDocumentModal.set(!this.showCreateNewDocumentModal());
    this.documentUuid = uuidv4();
  }

  deleteDocument(uuid: string) {
    this.documentService.deleteDocument(uuid).subscribe(() => {
      this.applicationService.getSingleApplicationDetails(this.application()!.uuid!.toString()).subscribe({
        next: (application: ApplicationDetails) => {
          this.application.set(application);
          this.getDocumentsMapListObject();
          this.toggleDeleteDocument();
        },
        error: (error) => {
          console.log(error);
        }
      });
    })
  }
  toggleDeleteDocument(uuid?: string) {
    if(!!uuid) {
      this.workingDocumentUuid.set(uuid);
      this.showDeleteDocument.set(!this.showDeleteDocument());
    }
      else {
      this.showDeleteDocument.set(!this.showDeleteDocument());
      this.workingDocumentUuid.set('');
    }
  }
  protected readonly ColumnMode = ColumnMode;

  getTTLDisplay(documentUuid: String, document: any) {
    this.setting_ttlService.TTLDisplay(documentUuid).subscribe({
      next: (response: TTLDisplay) => {
        document.ttl = response.ttl;
        console.log("TTL: " + response.ttl);
      },
      error: (error) => {
        console.log(error);
      }
    });
    }

  loadDocumentsTTL(documents: any[]) {
    console.log("Loading TTL for documents");
    documents.forEach((document) => {
      this.getTTLDisplay(document.uuid, document);
    });
  }
  navigateToDocumentLink(link: String) {
    const url = link.startsWith('http://') || link.startsWith('https://') ? link : 'https://' + link;
    window.open(url.toString(), '_blank');
  }
}
