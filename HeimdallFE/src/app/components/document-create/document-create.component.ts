import {Component, inject, Input, ViewChild} from '@angular/core';
import {CapitalizeFirstPipe} from "../../pipes/capitalize-first.pipe";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DocumentService} from "../../services/document.service";
import {Document} from "../../interfaces/document";
import {PopupNoticeComponent} from "../popup-notice/popup-notice.component";
import {ApplicationService} from "../../services/application.service";
import {Router} from "@angular/router";
import {Application} from "../../interfaces/Application";

@Component({
  selector: 'app-document-create',
  standalone: true,
  imports: [CapitalizeFirstPipe, ReactiveFormsModule, PopupNoticeComponent],
  template:`
    <app-popup-notice></app-popup-notice>
    <div class="flex flex-col p-4 max-w-lg mx-auto">
      <h2 class="flex justify-center text-2xl mb-4">Create {{type | capitalizeFirst}}</h2>

      <div class="flex items-center mb-4" [formGroup]="link">
        <p class=" w-44">Document Link:</p>
        <input type="url" formControlName="documentLink" placeholder="Enter document link" class="p-2 border border-gray-300 rounded flex-1">
      </div>

      <div class="flex items-center mb-4">
        <p class="mr-2 w-44">Application Key:</p>
        <span>{{ this.app_key }}</span>
      </div>

      <div class="flex items-center mb-4">
        <p class="mr-2 w-44">Document Type:</p>
        <span>{{ type }}</span>
      </div>

      <div class="flex justify-center">
        <button type="submit" (click)="createDocument()" [disabled]="!link.valid" class="btn btn-gray-custom">Create Document</button>
      </div>
    </div>

  `,
})
export class DocumentCreateComponent {
  @ViewChild(PopupNoticeComponent) notification!: PopupNoticeComponent;
  @Input() type!: String;
  @Input() typeUuid!: String;
  @Input() applicationUuid!: String;
  @Input() setDocumentExists!: Function;
  router = inject(Router);
  documentService = inject(DocumentService);
  app_key: String | undefined = '';
  applicationService = inject(ApplicationService);

  ngOnInit() {
    this.getApplicationKey();
  }

  link = new FormGroup({
    documentLink: new FormControl('')
  });

  getApplicationKey() {
    this.applicationService.getSingleApplication(this.applicationUuid).subscribe({
      next: (response: Application) => {
       this.app_key = response.app_key;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  createDocument() {
    let document: Document = {
      organization_uuid: 'ace2e137-d6e7-4476-9bc4-5c7a23c17ddd',
      uuid: this.typeUuid,
      link: this.link.get('documentLink')?.value || '',
      //TODO: make create document correct with type_uuid instead of type
      document_type_uuid: this.type,
      application_uuid: this.applicationUuid
    }
    this.documentService.createOrUpdateDocument(document).subscribe({
      next: (response) => {
        this.notification.display(this.type + ' Created Successfully');
        setTimeout(() => {
          this.setDocumentExists(this.applicationUuid, this.type);
        }, 5000);
      },
      error: (error) => {
        this.notification.display('Error Creating ' + this.type);
        console.log(error);
      }
    });
    }
}
