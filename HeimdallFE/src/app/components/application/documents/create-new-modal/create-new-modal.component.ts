import {Component, inject, Input, signal, WritableSignal} from '@angular/core';
import {Document_type} from "../../../../interfaces/document_type";
import {v4 as uuidv4} from "uuid";
import {Document} from "../../../../interfaces/document";
import {ApplicationDetails} from "../../../../interfaces/ApplicationDetails";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApplicationService} from "../../../../services/application.service";
import {DocumentService} from "../../../../services/document.service";
import {NotificationService} from "../../../../services/notification.service";
import {Document_typeService} from "../../../../services/document_type.service";
import {
  Document_typePickerComponent
} from "../../../team/requirement/document_type-picker/document_type-picker.component";

@Component({
  selector: 'app-create-new-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Document_typePickerComponent
  ],
  template: `
      <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40">

        <div class="flex flex-col items-center bg-gray-800 w-1/3 rounded-t-lg">
          @if (createNewDocument_type()) {
            <div class="mt-4 mb-4">
              <h3 class="text-white">Create Document_type</h3>
            </div>
            <div [formGroup]="createNewDocument_typeForm" class="flex flex-col w-9/12">
              <div class="flex mb-4">
                <label for="document_type" class="text-white mr-2 whitespace-nowrap ">Document type:</label>
                <input type="text" formControlName="document_type" placeholder="Document_type" id="document_type"
                       class="pl-1 h-[28px] rounded w-8/12 flex-1 "/>
              </div>
              <div class="flex mb-4">
                <label for="description" class="text-white mr-2 ">Description:</label>
                <textarea type="text" formControlName="description" placeholder="Description" id="description"
                          class="ml-[29px] pl-1 rounded w-8/12 flex-1"></textarea>
              </div>
              <div class="flex mb-4">
                <label for="link" class="text-white mr-2 ">Link:<span
                  class="ml-2 text-gray-800-500 text-xl cursor-help"
                  title="Link to more information about your requirement"
                >&#9432;</span></label>
                <input type="text" placeholder="Link" formControlName="specification_link" id="link"
                       class="pl-1 ml-[60px] rounded w-8/12 flex-1"/>
              </div>
            </div>
          } @else {
            <div class="mt-4 mb-4">
              <h3 class="text-white">Use Existing Document type</h3>
            </div>
            <div [formGroup]="createNewDocumentForm" class="flex flex-col w-9/12">
              <div class="flex mb-4">
                <label for="document_type" class="text-white mr-2 h-[28px] whitespace-nowrap ">Document type:</label>
                <div class="w-full">
                  @if (showDocument_typePicker()) {
                    <app-document_type-picker (showSignal)="showDocument_typePicker.set($event)"
                                              (document_typeEmitter)="handleDocument_typePicked($event)"></app-document_type-picker>
                  } @else {
                    <input type="text" readonly (click)="pickDocument_type()"
                           [value]="this.createNewDocumentForm.get('document_type')?.value?.uuid ? this.createNewDocumentForm.get('document_type')?.value?.name : ''"
                           placeholder="Search for Document type" id="document_type_existing"
                           class="pl-1 ml-[2px] h-[28px] rounded w-full flex-1 "/>
                  }
                </div>
              </div>
              <div class="flex mb-4">
                <label for="link" class="text-white mr-[28px] ">Link:<span
                  class="ml-2 text-gray-800-500 text-xl cursor-help"
                  title="Link to the document you are creating"
                >&#9432;</span></label>
                <input type="text" placeholder="Link" formControlName="link" id="link"
                       class="pl-1 rounded -mr-0.5 ml-[41.5px] w-full flex-1"/>
              </div>
            </div>
            <div>
              <button class="text-blue-400 mb-4 text-xs" (click)="createNewDocument_type.set(true)">Create new Document
                type
              </button>
            </div>
          }
        </div>

        <div class="flex justify-center bg-gray-700 w-1/3 rounded-b-lg">
          <div class="flex justify-center mt-4 mb-4">
            @if (createNewDocument_type()) {
              <button class="btn-gray-custom" [disabled]="createNewDocument_typeForm.invalid"
                      (click)="createNewDocumentType(); $event.stopPropagation()">Create Document Type
              </button>
              <button class="btn-gray-custom ml-4"
                      (click)="createNewDocument_type.set(false); $event.stopPropagation()">Back
              </button>
            } @else {
              <button class="btn-gray-custom" [disabled]="!createNewDocumentForm.valid" (click)="createNewDocument(); $event.stopPropagation()">Create Document
              </button>
              <button class="btn-gray-custom ml-4"
                      (click)="toggleShowCreateNewDocumentModal(); $event.stopPropagation()">Cancel
              </button>
            }
          </div>
        </div>

      </div>

  `
})
export class CreateNewModalComponent {
  @Input() application!: WritableSignal<ApplicationDetails | undefined>;
  @Input() documentUuid!: string;
  @Input() toggleShowCreateNewDocumentModal!: Function;
  @Input() getDocumentsMapListObject!: Function;
  createNewDocument_type = signal(false);
  showDocument_typePicker = signal(false);
  applicationService = inject(ApplicationService);
  documentService = inject(DocumentService);
  notificationService = inject(NotificationService);
  documentTypeService = inject(Document_typeService)
  createNewDocumentForm = new FormGroup({
    document_type: new FormControl(null as Document_type | null, Validators.required),
    link: new FormControl(''),
  });
  createNewDocument_typeForm = new FormGroup({
    document_type: new FormControl('', Validators.required),
    description: new FormControl(''),
    specification_link: new FormControl('')
  });

  createNewDocumentType()
  {
    if (this.createNewDocument_typeForm.valid) {
      const document_type: Document_type = {
        uuid: this.documentUuid,
        organization_uuid: this.application()?.organization_uuid || '',
        name: this.createNewDocument_typeForm.get('document_type')?.value || '',
        description: this.createNewDocument_typeForm.get('description')?.value || '',
        specification_link: this.createNewDocument_typeForm.get('specification_link')?.value || ''
      };

      this.documentTypeService.createOrUpdate(document_type).subscribe((response: Document_type) => {
        this.createNewDocument_typeForm.reset();
        this.documentUuid = uuidv4();
        this.createNewDocument_type.set(false);
        this.toggleShowCreateNewDocumentModal();
      });
    }
  }

  handleDocument_typePicked(document_type: Document_type) {
    this.createNewDocumentForm.get("document_type")?.setValue(document_type);
  }

  createNewDocument(){
    const document: Document = {
      uuid: this.documentUuid,
      link: this.createNewDocumentForm.get('link')?.value || '',
      document_type_uuid: this.createNewDocumentForm.get('document_type')?.value?.uuid || '',
      application_uuid: this.application()!.uuid!,
      organization_uuid: this.application()?.organization_uuid
    }
    this.documentService.createOrUpdateDocument(document).subscribe({
      next: (response) => {
        this.applicationService.getSingleApplicationDetails(this.application()!.uuid!.toString()).subscribe({
          next: (application: ApplicationDetails) => {
            if (application) {
              this.application.set(application);
              this.notificationService.getNotifications();
              this.getDocumentsMapListObject()
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.toggleShowCreateNewDocumentModal();
    this.createNewDocumentForm.reset();
  }

  pickDocument_type() {
    this.showDocument_typePicker.set(true);
  }
}
