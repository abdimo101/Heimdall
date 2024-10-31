import {Component, inject, Input, signal, WritableSignal} from '@angular/core';
import {Document_typePickerComponent} from "../requirement/document_type-picker/document_type-picker.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { Task } from '../../../interfaces/Task';
import {Document} from "../../../interfaces/document";
import {DocumentService} from "../../../services/document.service";
import {RouterLink} from "@angular/router";
import {ApprovalService} from "../../../services/approval.service";
import {SpinnerComponent} from "../../common/spinner.component";

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    Document_typePickerComponent,
    ReactiveFormsModule,
    RouterLink,
    SpinnerComponent
  ],
  templateUrl: './task-modal.component.html'
})
export class TaskModalComponent {
@Input() toggleTaskModal!: Function;
@Input() currentTask!: WritableSignal<Task | null>;
@Input() updateTeam!: Function;
documentService = inject(DocumentService)
  approvalService = inject(ApprovalService)
document: WritableSignal<Document | null> = signal(null)


  setStatusForm = new FormGroup({
    approval_uuid: new FormControl(''),
    status: new FormControl(''),
    comment: new FormControl('')
  });

ngOnInit() {
  this.documentService.getDocumentByApproval(this.currentTask()!.target_uuid!).subscribe((document: Document) => {
    this.document.set(document)
  })
}
  navigateToDocument(link: String) {
    const url = link.startsWith('http://') || link.startsWith('https://') ? link : 'https://' + link;
    window.open(url.toString(), '_blank');
  }

  setStatus(status: string) {
  this.setStatusForm.get('approval_uuid')?.setValue(this.currentTask()!.target_uuid!.toString());
    this.setStatusForm.get('status')?.setValue(status);
    const body = JSON.stringify(this.setStatusForm.value);
    this.approvalService.setStatus(body).subscribe(() => {
      this.setStatusForm.reset()
      this.toggleTaskModal()
      this.updateTeam()
    })

  }
}
