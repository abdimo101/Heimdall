import {Component, effect, inject, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationService} from "../../services/application.service";
import {Document} from "../../interfaces/document";
import {DocumentCreateComponent} from "../document-create/document-create.component";
import {DocumentComponent} from "../document/document.component";
import {DocumentService} from "../../services/document.service";
import {Document_typeService} from "../../services/document_type.service";
import {SpinnerComponent} from "../common/spinner.component";
import {finalize} from "rxjs";

@Component({
  selector: 'app-document-container',
  standalone: true,
  imports: [
    DocumentCreateComponent,
    DocumentComponent,
    SpinnerComponent,
  ],
  templateUrl: './document-container.component.html'
})
export class DocumentContainerComponent {
  documentExists: WritableSignal<boolean> = signal(false);
  documentTypeExists: WritableSignal<boolean> = signal(false);
  documentIsLoading: WritableSignal<boolean> = signal(true);
  documentTypeIsLoading: WritableSignal<boolean> = signal(true);
  applicationUuid = '';
  documentTypeUuid = '';
  documentUuid = '';
  document: Document | undefined = undefined;
  documentTypeName = '';
  route = inject(ActivatedRoute);
  applicationService = inject(ApplicationService);
  documentService = inject(DocumentService);
  documentTypeService = inject(Document_typeService);

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.applicationUuid = this.route.snapshot.paramMap.get('uuid') || '';
    this.documentTypeUuid = this.route.snapshot.paramMap.get('documentTypeUuid') || '';
    this.documentUuid = this.route.snapshot.paramMap.get('documentUuid') || '';
    this.documentTypeService.getDocumentType(this.documentTypeUuid).pipe(finalize(() => {
      this.documentTypeIsLoading.set(false);

    })).subscribe({
      next: (response) => {
        this.documentTypeName = response.name || '';
        this.documentTypeExists.set(true);
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.documentService.getDocument(this.documentUuid).pipe(finalize(() => {
      this.documentIsLoading.set(false);
    })).subscribe({
      next: (response: Document) => {
        this.document = response;
        this.documentExists.set(true);
      },
      error: (error) => {
        if (error.status === 404) {
          this.documentExists.set(false);
        } else {
          console.log(error);
        }
      }
    });
  }

  redirectEffect = effect(() => {
    if (!this.documentIsLoading() && !this.documentTypeIsLoading()) {
      if (!this.documentExists() || !this.documentTypeExists()) {
        this.router.navigate(['/org/application/' + this.applicationUuid])
      }
    }
  });
}
