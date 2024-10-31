import {Component, Input, WritableSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SpinnerComponent} from "../../common/spinner.component";
import {Document} from "../../../interfaces/document";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-missing-approvals-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    RouterLink
  ],
  templateUrl: './missing-approvals-modal.component.html'
})
export class MissingApprovalsModalComponent {
  @Input() toggleMissingApprovalsModal!: Function;
  @Input() document!: WritableSignal<any | null>
}
