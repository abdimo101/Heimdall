import {Component, effect, inject, Input, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgClass, DatePipe} from "@angular/common";
import {ApplicationService} from "../../services/application.service";
import {CapitalizeFirstPipe} from "../../pipes/capitalize-first.pipe";
import {Document} from "../../interfaces/document";
import {ApprovalService} from "../../services/approval.service";
import {Approval} from "../../interfaces/approval";
import {Application} from "../../interfaces/Application";
import {DocumentService} from "../../services/document.service";
import {Router} from "@angular/router";
import {SpinnerComponent} from "../common/spinner.component";
import { ApprovalAuditInfo } from '../../interfaces/ApprovalAuditInfo.interface';
import { TTLDisplay } from '../../interfaces/TTLDisplay';
import { Setting_TTLService } from '../../services/setting_ttl.service';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    CapitalizeFirstPipe,
    SpinnerComponent,
    DatePipe
  ],
  template:`
    @if (isLoading) {
      <div class="flex flex-col mt-32 justify-center items-center">
        <app-spinner/>
      </div>
    } @else {
      <div class="flex flex-col items-center p-4">
        <div class="mb-4">
          <h3 class="text-2xl">{{ type | capitalizeFirst }} - {{ appKey() }}</h3>
        </div>
        <div class="flex flex-col w-full max-w-lg">
          <div class="flex items-center mb-4">
            <p class="mr-2 leading-10 w-40">Link to Document: </p>
            @if (isLinkBeingEdited()) {
              <form [formGroup]="documentForm" (ngSubmit)="saveUrl()">
                <input type="text" formControlName="documentLink" class="p-2 border border-gray-300 rounded flex-1"/>
                <button type="submit" class="btn btn-gray-custom ml-4">Save</button>
              </form>
            } @else {
              <a href="{{documentForm.value.documentLink}}"
                 class="link">{{ documentForm.value.documentLink }}</a>
              <button class="btn btn-gray-custom ml-4" (click)="setEditTrue()">Edit</button>
            }
          </div>
          <div class="flex items-center">
            @if (approvalAuditInfo?.operation_timestamp != null){
              <p class="text-base font-medium text-gray-700">
                Last approved date:
                <span class="font-normal text-gray-600 ml-4">
          {{ approvalAuditInfo?.operation_timestamp?.toString() | date:'dd MMM y' }}
        </span>
              </p>
            } @else {
              <p class="text-base font-medium text-gray-700">
                Last approved date:
                <span class="font-normal text-red-600 ml-4">
          Document is not approved
        </span>
              </p>
            }
          </div>

          <!-- Approval Valid Until Section -->
          <div class="flex items-center">
            @if (ttl?.ttl != null) {
              <p class="text-base font-medium text-gray-700">
                Approval valid until:
                <span class="font-normal text-gray-600 ml-4">
          {{ ttl?.ttl?.toString() | date:'dd MMM y' }}
        </span>
              </p>
            } @else {
              <p class="text-base font-medium text-gray-700">
                Approval valid until:
                <span class="font-normal text-red-600 ml-4">
          Document is not approved
        </span>
              </p>
            }
          </div>
        </div>
        @if (approval?.status !== 'pending') {
            <button [ngClass]="requestSuccess ? 'btn mt-4 w-48 disabled:bg-green-600 disabled:text-gray-900' : 'btn btn-gray-custom mt-4 w-48'" [disabled]="processingRequest||requestSuccess" (click)="sendToApproval()">
              @if (processingRequest) {
                <app-spinner/>
              } @else {
                {{requestSuccess ? 'Request sent' : 'Send to approval'}}
              }
            </button>
        }
        @if (approval?.status === 'pending') {
          <div class="bg-gray-150 border-t border-b border-cyan-600 text-gray-900 px-4 py-3 mt-4 rounded-md"
               role="alert">
            <p class="flex justify-center font-bold text-cyan-600">Notice</p>
            <p class="text-sm">This {{ type }} is currently out for approval.</p>
          </div>
        }
      </div>
    }
  `,
})
export class DocumentComponent {

  @Input() type!: String;
  @Input() typeUuid!: String;
  @Input() applicationUuid!: String;
  @Input() document!: Document | undefined;
  appKey: WritableSignal<string> = signal('');
  documentService = inject(DocumentService);
  applicationService = inject(ApplicationService)
  approvalService = inject(ApprovalService);
  isLinkBeingEdited = signal(false);
  isLoading: boolean = true;
  approvalUuid: String = '';
  approval: Approval | undefined = undefined;
  processingRequest: boolean = false;
  requestSuccess: boolean = false;
  approvalAuditInfo: ApprovalAuditInfo | undefined = undefined;
  ttl: TTLDisplay | undefined = undefined;
  setting_TTLService = inject(Setting_TTLService);
  constructor(private router: Router) {
  }

  documentForm = new FormGroup({
    documentLink: new FormControl(this.document?.link),
    documentUuid: new FormControl(this.document?.uuid),
    documentTypeUuid: new FormControl(this.document?.document_type_uuid),
    organizationUuid: new FormControl(this.document?.organization_uuid),
    applicationUuid: new FormControl(this.applicationUuid)
  })

  ngOnInit() {
    this.getApplicationKey();
    this.approvalUuid = this.document?.approvals?.[0]?.uuid || '';
    if(this.approvalUuid !== ''){
      this.getApproval();
    }
    this.documentForm.get('documentLink')?.setValue(this.document?.link);
    this.documentForm.get('documentUuid')?.setValue(this.document?.uuid);
    this.documentForm.get('documentTypeUuid')?.setValue(this.document?.document_type_uuid);
    this.documentForm.get('organizationUuid')?.setValue(this.document?.organization_uuid);
    this.documentForm.get('applicationUuid')?.setValue(this.applicationUuid);
    this.getLatestApprovalByDocument();
    this.getTTLDisplay();
    console.log(this.document)
    console.log(this.documentForm.value)
  }

  loadingEffect = effect(() => {
    if(this.appKey() !== ''){
      this.isLoading = false;
    }
  });

  getApplicationKey() {
    this.applicationService.getSingleApplication(this.applicationUuid).subscribe({
      next: (response: Application) => {
        this.appKey.set(response.app_key?.toString() || '');
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getApproval(){
    this.approvalService.getApproval(this.approvalUuid).subscribe({
      next: (response: Approval) => {
        this.approval = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
    }

  setEditTrue(){
    this.isLinkBeingEdited = signal(true);
  }

  saveUrl() {
    this.isLinkBeingEdited = signal(false);
    let document: Document = {
      uuid: this.documentForm.get('documentUuid')?.value!,
      document_type_uuid: this.documentForm.get('documentTypeUuid')?.value!,
      organization_uuid: this.documentForm.get('organizationUuid')?.value!,
      link: this.documentForm.get('documentLink')?.value!,
      application_uuid: this.documentForm.get('applicationUuid')?.value!
    }
    this.documentService.createOrUpdateDocument(document).subscribe({
      next: (response) => {
        console.log('Document Updated', response);
      },
      error: (error) => {
        console.log('Error Updating Document', error);
    }})
  }
  sendToApproval(){
    this.processingRequest = true;
    this.documentService.initiateDocumentApproval(this.document?.uuid || '').subscribe({
      next: (response) => {
        this.requestSuccess = true;
        this.processingRequest = false;
        setTimeout(() => {
          this.router.navigate(['/org/application/' + this.applicationUuid])
        }, 2000);
      },
      error: (error) => {
        console.log('Error Initiating Approval', error);
        this.processingRequest = false;
      }
    })
    }

  getLatestApprovalByDocument(){
    this.documentService.getLatestApprovalByDocument(this.document?.uuid || '').subscribe({
      next: (response: ApprovalAuditInfo) => {
        this.approvalAuditInfo = response;
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
  });
}

getTTLDisplay() {
  this.setting_TTLService.TTLDisplay(this.document?.uuid || '').subscribe({
    next: (response: TTLDisplay) => {
      this.ttl = response;
      console.log("TTL: " + this.ttl);
    },
    error: (error) => {
      console.log(error);
    }
  });
  }

navigateToUser(userUuid: string | undefined) {
  if (userUuid) {
    this.router.navigate(['/org/user', userUuid]);
  }
}
}
