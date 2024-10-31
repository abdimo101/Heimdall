import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
  output,
  signal,
  ViewChild
} from '@angular/core';
import {Document_type} from "../../../../interfaces/document_type";
import {Document_typeService} from "../../../../services/document_type.service";
import {Subject, switchMap, throttleTime} from "rxjs";

@Component({
  selector: 'app-document_type-picker',
  standalone: true,
  imports: [],
  template:`
    <div #searchContainer class="flex w-full h-full">
      <div
        class="bg-white text-black rounded shadow-lg ml-[3px] w-full flex flex-1 flex-col">
        <input #searchInput type="text" class="pl-1 h-[28px] rounded -mr-0.5 -ml-[1px]" placeholder="Search for Document type"
               (input)="handleSearchChange($event)">
      </div>
    </div>
    @if (document_typeSuggestions().length > 0) {
      <div class="absolute bg-white rounded-b-lg w-full" [style.width.px]="searchContainerWidth">
        @for (document_type of document_typeSuggestions(); track document_type.uuid) {
          <div class="flex flex-row hover:bg-gray-400 p-1 border-b" (click)="handleDocument_typePicked(document_type)">
            <div class="flex flex-col">
              <p class="ml-2">{{ document_type.name }}</p>
              <p class="ml-2">({{ document_type.description }})</p>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class Document_typePickerComponent {
  showSignal = output<boolean>();
  @Output() document_typeEmitter = new EventEmitter<Document_type>();
  document_typeService = inject(Document_typeService);
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchContainer') searchContainer!: ElementRef<HTMLDivElement>;
  document_typeSuggestions = signal([] as Document_type[]);
  searchContainerWidth = 0;
  searchSubject = new Subject<string>();

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
    this.searchContainerWidth = this.searchContainer.nativeElement.offsetWidth;

    this.searchSubject.pipe(
      throttleTime(500),
      switchMap((query: string) => this.document_typeService.searchDocument_types(query))
    ).subscribe((document_types: [Document_type]) => {
      this.document_typeSuggestions.set(document_types);
    }, (error) => {
      console.error('Error searching for document_types:', error);
    });
  }

  handleSearchChange(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  handleDocument_typePicked(document_type: Document_type) {
    this.document_typeEmitter.emit(document_type);
    this.close();
  }

  close() {
    this.showSignal.emit(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-picker-container')) {
      this.close();
    }
  }


}
