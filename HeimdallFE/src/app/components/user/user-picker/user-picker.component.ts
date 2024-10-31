import {
  Component, ElementRef,
  EventEmitter,
  HostListener,
  inject,
  output,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {User} from "../../../interfaces/User.interface";
import {UserService} from "../../../services/user.service";
import {switchMap, throttleTime, Subject} from "rxjs";

@Component({
  selector: 'app-user-picker',
  standalone: true,
  imports: [],
  template: `
    <div #searchContainer class="flex w-full h-full">
      <div
        class="user-picker-container bg-white text-black rounded-b-lg shadow-lg border border-black w-full flex flex-col">
        <input #searchInput type="text" class="p-2 w-full" placeholder="Search for user"
               (input)="handleSearchChange($event)">
      </div>
    </div>
    @if (userSuggestions().length > 0) {
      <div class="absolute bg-white rounded-b-lg w-full" [style.width.px]="searchContainerWidth">
        @for (user of userSuggestions(); track user.id) {
          <div class="flex flex-row hover:bg-gray-400 p-1 border-b" (click)="handleUserPicked(user)">
            <div class="flex flex-col">
              <p class="ml-2">{{ user.name }}</p>
              <p class="ml-2">({{ user.email }})</p>
            </div>
          </div>
        }
      </div>
    }
  `
})
export class UserPickerComponent {
  showSignal = output<boolean>();
  @Output() userEmitter = new EventEmitter<User>();
  userService = inject(UserService);
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchContainer') searchContainer!: ElementRef<HTMLDivElement>;
  userSuggestions = signal([] as User[]);
  searchContainerWidth = 0;
  searchSubject = new Subject<string>();

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
    this.searchContainerWidth = this.searchContainer.nativeElement.offsetWidth;

    this.searchSubject.pipe(
      throttleTime(500),
      switchMap((query: string) => this.userService.searchUsers(query))
    ).subscribe((users: [User]) => {
      this.userSuggestions.set(users);
    }, (error) => {
      console.error("Error searching users:", error);
    });
  }

  handleSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  handleUserPicked(user: User) {
    this.userEmitter.emit(user)
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
