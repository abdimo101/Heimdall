import {Component, effect, inject, Input, signal, ViewChild, WritableSignal} from '@angular/core';
import {UserPickerComponent} from "../../user/user-picker/user-picker.component";
import {RouterLink} from "@angular/router";
import {User} from "../../../interfaces/User.interface";
import {Team} from "../../../interfaces/Team.interface";
import {TeamService} from "../../../services/team.service";
import {TeamDetails} from "../../../interfaces/team-details";
import {ColumnMode, DatatableComponent, NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RequirementDocument_type} from "../../../interfaces/requirement-document_type";

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    UserPickerComponent,
    RouterLink,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `

      <!-- Add Member Modal -->
    @if (showAddMemberModal())
      {
        <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-40 z-10" (click)="$event.stopPropagation()">
          <div class="flex flex-col bg-gray-800 rounded-lg w-1/3 items-center" (click)="$event.stopPropagation()">
            <div >
              <h3 class="text-lg font-semibold text-white p-4">Add New Member</h3>
            </div>
            <div class="w-9/12 pl-4 mb-4 ">
              <app-user-picker (showSignal)="showAddMemberModal.set($event)"
                               (userEmitter)="addMember($event)"></app-user-picker>
            </div>
            <div class="flex items-center justify-center bg-gray-700 w-full min-h-10 rounded-b-lg">
              <div class="flex">
                <button class="btn-gray-custom mb-4 mt-4 mr-4">Add</button>
                <button class="btn-gray-custom mb-4 mt-4" (click)="toggleShowAddMemberModal(); $event.stopPropagation()">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      }

    <div class="flex mb-4 ml-4 -mt-4">
      <div [formGroup]="filterForm" class="flex ">
        <select formControlName="filter" class="p-2 border ml-2 border-gray-300 rounded bg-gray-200 mr-2 shadow">
          <option disabled value="">Search for...</option>
          <option value="name" >Name</option>
          <option value="email" >Email</option>
        </select>
      </div>
      <div>
        <input class="flex shadow rounded-lg p-2 bg-gray-200 border-gray-300 border min-w-96"
               type="text"
               placeholder="Type to search for chosen field"
               (keyup)="updateFilter($event)"
        />
      </div>
      <div>
        <button class="text-blue-500 text-xs hover:text-blue-700 ml-2" (click)="showAddMemberModal.set(true); $event.stopPropagation()">Add new member</button>
      </div>
    </div>

      <div class="mt-4 space-y-4">
        <ngx-datatable
          #table
          class="material"
          [columnMode]="ColumnMode.force"
          [headerHeight]="50"
          [footerHeight]="50"
          rowHeight="auto"
          [limit]="6"
          [rows]="rows"
          [sorts]="[{ prop: 'key', dir: 'asc' }]"
        >
        <ngx-datatable-column name="NAME" prop="name">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer " (click)="navigateToUser(row.user_id); $event.stopPropagation()">

              <span class="chip-content ">{{ row.name }}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="EMAIL" prop="email">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer ">
              <span class="chip-content ">{{ row.email}}</span>
            </div>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="" prop="po" [sortable]="false">
          <ng-template ngx-datatable-cell-template let-row="row">
            <div class="text-gray-500 hover:text-gray-800 cursor-pointer ">
              <button class="ml-4 text-red-600 hover:text-red-800 flex-none" (click)="deleteMember(row.user_id!); $event.stopPropagation()">Remove</button>
            </div>
          </ng-template>
        </ngx-datatable-column>
        </ngx-datatable>
      </div>
  `,
  styles:`
    .ngx-datatable {
      border-radius: 10px;
      box-shadow: none !important;

    }

    :host ::ng-deep.datatable-header{
      background: #fff;
      color: #000000;
      opacity: 0.9;
    }
    :host ::ng-deep ngx-datatable.fixed-header
    .datatable-header-inner
    .datatable-header-cell {
      background: #ffffff;
      color: #000000;
      opacity: 0.9;
      text-wrap: wrap !important;
      word-wrap: break-word !important;
    }
  `
})
export class MembersComponent {
  @ViewChild(DatatableComponent) table: DatatableComponent | undefined;
  showAddMemberModal: WritableSignal<boolean> = signal(false);
  @Input() team!: WritableSignal<TeamDetails | null>;
  @Input() teamUuid!: string;
  @Input() navigateToUser!: Function;
  filterForm = new FormGroup({
    filter: new FormControl('name')
  });

  rows: any[] = [];
  temp: any[] = [];

  teamService = inject(TeamService);

  ngOnInit() {
    this.getMembersMapListObject();
  }

  updateMembersEffect = effect(() => {
    if(this.team())
    {
        this.getMembersMapListObject();
    }
  })

  toggleShowAddMemberModal() {
    this.showAddMemberModal.set(!this.showAddMemberModal());
  }

  addMember(user: User) {
    if (this.team) {
      this.teamService.addMemberToTeam(this.teamUuid, user.id).subscribe(() => {
        this.teamService.getTeamDetails(this.teamUuid).subscribe((team) => {
          this.team.set(team);
          this.getMembersMapListObject()
        });
      });
      this.toggleShowAddMemberModal();
    }
  }

  deleteMember(user: string) {
    if (this.team) {
      this.teamService.deleteMemberFromTeam(this.teamUuid, user).subscribe(() => {
        this.teamService.getTeamDetails(this.teamUuid).subscribe((team) => {
          this.team.set(team);
          this.getMembersMapListObject()
        });
      });
    }
  }

  getMembersMapListObject() {
    this.rows = this.team()!.users!.map(user => ({
      name: user.name,
      user_id: user.id || '',
      email: user.email || '',
    }));
    this.temp = [...this.rows];
  }

  protected readonly ColumnMode = ColumnMode;

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    let templocal: any[] = [];
    switch (this.filterForm.value.filter) {
      case 'name':
        templocal = this.temp.filter(function (d) {
          return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'email':
        templocal = this.temp.filter(function (d) {
          return d.email.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
    }
    this.rows = templocal;
    // Whenever the filter changes, always go back to the first page
    this.table!.offset = 0;
  }
  reloadTable(){
    this.table?.recalculate();
  }
}
