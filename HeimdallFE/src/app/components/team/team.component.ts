import {Component, effect, inject, OnInit, signal, ViewChild, WritableSignal} from '@angular/core';
import {CardComponent} from "../card/card.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CapitalizeFirstPipe} from "../../pipes/capitalize-first.pipe";
import {TeamService} from "../../services/team.service";
import {TeamDetails} from "../../interfaces/team-details";
import { RequirementService } from '../../services/requirement.service';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {v4 as uuidv4} from 'uuid';
import { CommonModule } from '@angular/common';
import {UserPickerComponent} from "../user/user-picker/user-picker.component";
import {User} from "../../interfaces/User.interface";
import {Application} from "../../interfaces/Application";
import {RequirementComponent} from "./requirement/requirement.component";
import {PhaseService} from "../../services/phase.service";
import {Phase} from "../../interfaces/phase";
import {RequirementDocument_type} from "../../interfaces/requirement-document_type";
import {PopupNoticeComponent} from "../popup-notice/popup-notice.component";
import {TaskModalComponent} from "./task-modal/task-modal.component";
import { Task } from '../../interfaces/Task';
import {ColumnMode, DatatableComponent, NgxDatatableModule} from "@swimlane/ngx-datatable";
import {MembersComponent} from "./members/members.component";
import {TemporalAdjusters} from "@js-joda/core";
import next = TemporalAdjusters.next;
import {UiStore} from "../../stores/global/ui.store";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CardComponent,
    CapitalizeFirstPipe,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    UserPickerComponent,
    RequirementComponent,
    PopupNoticeComponent,
    TaskModalComponent,
    NgxDatatableModule,
    MembersComponent
  ],
  templateUrl: './team.component.html',
  styles: `
    .ngx-datatable {
      border-radius: 8px;
      box-shadow: none !important;

    }
    :host ::ng-deep.datatable-header
    {
      background: #111827;
      color: #fff;
      opacity: 0.9;
    }

    :host ::ng-deep ngx-datatable.fixed-header
    .datatable-header-inner
    .datatable-header-cell {
      background: #111827;
      color: #fff;
      opacity: 0.9;
      text-wrap: wrap !important;
      word-wrap: break-word !important;

    }
  `,
})
export class TeamComponent implements OnInit {
  @ViewChild(PopupNoticeComponent) notification!: PopupNoticeComponent;
  uuid = '';
  requirements: RequirementDocument_type[] = [];

  constructor(private router: Router, private fb: FormBuilder, private requirementService: RequirementService) {
    this.requirementForm = this.fb.group({
      document_type: ['', Validators.required]
    });
    this.uuid = uuidv4();
  }

  route = inject(ActivatedRoute)
  showMembers = false;
  showAssignModal: WritableSignal<boolean> = signal(false);

  showResponsibleUserPicker: WritableSignal<boolean> = signal(false)
  responsibleUserModal: WritableSignal<User | null> = signal(null);
  workingOn: WritableSignal<Application | null> = signal(null)
  phases: WritableSignal<Phase[] | null> = signal(null);
  specificRequirement: WritableSignal<String | null> = signal("");
  showTaskModal = signal(false)
  currentTask: WritableSignal<Task | null> = signal(null)
  taskRows: any[] = [];
  taskTemp: any[] = [];
  applicationRows: any[] = [];
  applicationTemp: any[] = [];
  filterForm = new FormGroup({
    filterTask: new FormControl('key'),
    filterApplication: new FormControl('key'),
    applicationRows: new FormControl(6),
    taskRows: new FormControl(6)
  });
  showRequirement = false;
  teamService = inject(TeamService)
  phaseService = inject(PhaseService)
  teamUuid = '';
  team: WritableSignal<TeamDetails | null> = signal(null);
  requirementForm: FormGroup;
  sideBarOpen = inject(UiStore).sidebarOpen;
  @ViewChild("taskTable", {static: false}) taskTable: DatatableComponent | undefined;
  @ViewChild("applicationTable", {static: false}) applicationTable: DatatableComponent | undefined;
  @ViewChild(RequirementComponent) reqCom: RequirementComponent | undefined;
  @ViewChild(MembersComponent) membersCom: MembersComponent | undefined;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.teamUuid = params.get('uuid') || '';
      this.teamService.getTeamDetails(this.teamUuid).subscribe((team) => {
        this.team.set(team);
        this.getApplicationMapListObject()
        this.getTasksMapListObject()
        this.loadRequirements();
        this.getAllPhases()
      });
    })
  }

  reloadTablesEffect = effect(() => {
    this.sideBarOpen()
    this.reloadTables()
  })


  loadRequirements() {
    this.requirementService.getRequirementsWithDocument_types(this.teamUuid).subscribe((requirements: RequirementDocument_type[]) => {
      this.requirements = requirements;
    });
  }

  getAllPhases(){
    this.phaseService.getAllPhases().subscribe((phases) => {
      this.phases.set(phases);
      this.phases.set(this.phases()!.sort((a, b) => a.order_number! - b.order_number!));
    });
  }
  toggleMembers() {
    this.showMembers = !this.showMembers
  }

  toggleRequirement() {
    this.showRequirement = !this.showRequirement
  }

  updateTeam() {
    this.teamService.getTeamDetails(this.teamUuid).subscribe((team) => {
      this.team.set(team);
      this.loadRequirements()
      this.getTasksMapListObject()
      this.getApplicationMapListObject()
    });
  }


  calculateTasks(applicationUuid: String): number {
    if (!this.team() || !this.team()?.tasks) {
      return 0;
    }
    return this.team()!.tasks!.filter(t => t.application_uuid === applicationUuid && t.status !== 'completed').length;
  }


  triggerModal(application: Application | null) {
    this.showAssignModal.set(!this.showAssignModal())
    this.workingOn.set(application)
  }

  assignResponsibleUser() {
    if (this.workingOn() && this.responsibleUserModal() !== null) {
      this.teamService.assignResponsibleUser(this.teamUuid, this.responsibleUserModal()!.id, this.workingOn()!.uuid).subscribe(() => {
        this.loadRequirements();
        this.teamService.getTeamDetails(this.teamUuid).subscribe((team) => {
          this.team.set(team);
          this.getApplicationMapListObject()
        });
      });
      this.showAssignModal.set(false);
    }
  }
  toggleSpecificRequirement(requirement: String)
  {
    if(requirement == this.specificRequirement())
    {
      this.specificRequirement.set(null)
    }
    else
    {
      this.specificRequirement.set(requirement)
    }
  }
  checkIfUserIsPartOfTeam(user: User) {
    if (this.team()?.users?.some(u => u.id === user.id)) {
      this.responsibleUserModal.set(user);
    } else {
      this.responsibleUserModal.set(null);
      this.notification.display('That user is not part of this team');
    }
  }

  toggleTaskModal(task?: Task) {
      this.showTaskModal.set(!!task);
      if(task)
      {
        task.app_key = this.team()?.applications?.find(a => a.uuid === task.application_uuid)?.app_key || '';
        this.currentTask.set(task)
      }
      else
      {
        this.currentTask.set(null)
      }
    }

  protected readonly ColumnMode = ColumnMode;

  getTasksMapListObject() {
    this.taskRows = this.team()!.tasks!
      .filter(task => task.status !== 'completed')
      .map(task => ({
        key: task.app_key,
        application_uuid: task.application_uuid,
        task: task.target_table,
        type: task.document_type_name,
        responsible_user_name: task.responsible_user_name || 'N/A',
        responsible_user_id: task.responsible_user_id,
        full_task: task,
      }));
    this.taskTemp = [...this.taskRows];
  }

  getApplicationMapListObject() {
      this.applicationRows = this.team()!.applications!
        .map(application => ({
          key: application.app_key,
          uuid: application.uuid,
          tasks: this.calculateTasks(application.uuid).toString(),
          responsible_user_name: application.responsible_user_name || '',
          responsible_user_id: application.responsible_user_id,
          full_application: application
        }));

    this.applicationTemp = [...this.applicationRows];
  }

  navigateToApplication(uuid: String) {
    this.router.navigate(['/org/application/' + uuid]);
  }
  navigateToUser(id: String) {
    this.router.navigate(['/org/user/' + id]);
  }

  updateTaskFilter(event: any) {
    const val = event.target.value.toLowerCase();
    let templocal: any[] = [];
    switch (this.filterForm.value.filterTask) {
      case 'key':
        templocal = this.taskTemp.filter(function (d) {
          return d.key.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'task':
        templocal = this.taskTemp.filter(function (d) {
          return d.task.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'type':
        templocal = this.taskTemp.filter(function (d) {
          return d.type.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'responsible user':
        templocal = this.taskTemp.filter(function (d) {
          return d.responsible_user_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'description':
        templocal = this.taskTemp.filter(function (d) {
          return d.description.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
    }

    // update the rows
    this.taskRows = templocal;
    // Whenever the filter changes, always go back to the first page
    this.taskTable!.offset = 0;
  }
  updateApplicationFilter(event: any) {
    const val = event.target.value.toLowerCase();
    let templocal: any[] = [];
    switch (this.filterForm.value.filterApplication) {
      case 'key':
        templocal = this.applicationTemp.filter(function (d) {
          return d.key.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'responsible user':
        templocal = this.applicationTemp.filter(function (d) {
          return d.responsible_user_name.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'tasks':
        templocal = this.applicationTemp.filter(function (d) {
          return d.tasks.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
    }

    // update the rows
    this.applicationRows = templocal;
    // Whenever the filter changes, always go back to the first page
    this.applicationTable!.offset = 0;
  }
  reloadTables(){
    setTimeout(() => {
      this.applicationTable!.recalculate()
      this.taskTable!.recalculate()
      this.reqCom?.reloadTable()
      this.membersCom?.reloadTable()
    }, 330);
  }
}
