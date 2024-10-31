import {Component, effect, inject, Input, signal, ViewChild, WritableSignal} from '@angular/core';
import {Requirement} from "../../../interfaces/Requirement";
import {v4 as uuidv4} from "uuid";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TeamDetails} from "../../../interfaces/team-details";
import {RequirementService} from "../../../services/requirement.service";
import {Document_type} from "../../../interfaces/document_type";
import {Document_typePickerComponent} from "./document_type-picker/document_type-picker.component";
import {Document_typeService} from "../../../services/document_type.service";
import {RequirementDocument_type} from "../../../interfaces/requirement-document_type";
import {RequirementWithNames} from "../../../interfaces/requirement-with-names";
import {ColumnMode, DatatableComponent, NgxDatatableModule} from "@swimlane/ngx-datatable";
import {Router} from "@angular/router";

@Component({
  selector: 'app-requirement',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Document_typePickerComponent,
    NgxDatatableModule
  ],
  templateUrl: './requirement.component.html',
  styles: `
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
      background: #fff;
      color: #000000;
      opacity: 0.9;
      text-wrap: wrap !important;
      word-wrap: break-word !important;
    }
  `,
})
export class RequirementComponent {

  constructor(private router: Router, private requirementService: RequirementService) {
  }
  @ViewChild(DatatableComponent) table: DatatableComponent | undefined;
  @Input() requirements!: RequirementDocument_type[];
  @Input() loadRequirements!: Function;
  @Input() phase!: string;
  @Input() team!: WritableSignal<TeamDetails | null>;
  @Input() updateTeam!: Function;
  document_typeService = inject(Document_typeService);
  showModal: WritableSignal<boolean>  = signal(false);
  createNewDocument_type: WritableSignal<boolean>  = signal(false);
  showDocument_typePicker = signal(false);
  input: WritableSignal<string> = signal('');
  showOtherTeamsRequirementsModal: WritableSignal<boolean> = signal(false);
  otherRequirements: WritableSignal<RequirementWithNames[]> = signal([]);
  groupedRequirements: WritableSignal<any[]> = signal([]);
  temp: any[] = [];
  rowsReq: any[] = [];
  uuid = uuidv4();
  filterFormReq = new FormGroup({
    filter: new FormControl('document_type')
  });

  addRequirementForm = new FormGroup({
    document_type: new FormControl(null as Document_type | null, Validators.required),
    waitTime: new FormControl('')

  });
  createDocument_typeForm = new FormGroup({
    document_type: new FormControl('', Validators.required),
    description: new FormControl(''),
    specification_link: new FormControl(''),
    waitTime: new FormControl('')
  });

  updateRequirementsEffect = effect(() => {
    if(this.team())
    {
      this.requirementService.getRequirementsWithDocument_types(this.team()!.uuid.toString()).subscribe((requirements: RequirementDocument_type[]) => {
        this.requirements = requirements;
        this.getRequirementsMapListObject();
      });
    }
  })


  ngOnInit() {
    this.getRequirementsMapListObject()
  }

  getRequirementsByPhase(phase: string): RequirementDocument_type[] {
    return this.requirements.filter(c => c.phase_uuid === phase);
  }
  toggleModal() {
    this.showModal.set(!this.showModal());
  }
  toggleOtherTeamsRequirementsModal() {
    this.showOtherTeamsRequirementsModal.set(!this.showOtherTeamsRequirementsModal())
    this.requirementService.getAllRequirementsExceptTeam(this.team()!.uuid.toString(), this.phase).subscribe((response: RequirementWithNames[]) => {
      this.otherRequirements.set(response);
      this.groupedRequirements.set(this.getGroupedRequirements());
    });
  }

  addRequirement() {
    if(this.addRequirementForm.valid)
    {
       const requirement: Requirement = {
         uuid: this.uuid,
         organization_uuid: this.team()!.organization_uuid,
         team_uuid: this.team()!.uuid,
         estimated_wait_time: this.addRequirementForm.get('waitTime')?.value || undefined,
         document_type_uuid: this.addRequirementForm.get('document_type')?.value?.uuid,
         phase_uuid: this.phase
       }
         this.requirementService.createRequirement(requirement).subscribe((response: Requirement) => {
            this.addRequirementForm.reset();
            this.uuid = uuidv4();
           this.requirementService.getRequirementsWithDocument_types(this.team()!.uuid.toString()).subscribe((requirements: RequirementDocument_type[]) => {
             this.requirements = requirements;
             this.getRequirementsMapListObject();
           });
            this.toggleModal();
         });
    }
  }

  createDocument_type() {
    if (this.createDocument_typeForm.valid) {
      const document_type: Document_type = {
        uuid: this.uuid,
        organization_uuid: this.team()!.organization_uuid,
        owner_team_uuid: this.team()!.uuid,
        name: this.createDocument_typeForm.get('document_type')?.value || '',
        description: this.createDocument_typeForm.get('description')?.value || '',
        specification_link: this.createDocument_typeForm.get('specification_link')?.value || ''
      };

      this.document_typeService!.createOrUpdate(document_type).subscribe((response: Document_type) => {
        this.createDocument_typeForm.reset();
        this.uuid = uuidv4();
        this.createNewDocument_type.set(false);
        this.toggleModal();
      });
    }
  }

  handleDocument_typePicked(document_type: Document_type) {
    this.addRequirementForm.get("document_type")?.setValue(document_type);
  }

  pickDocument_type() {
    this.showDocument_typePicker.set(true);
  }
  getGroupedRequirements() {
      const grouped: { [key: string]: RequirementWithNames[] } = {};
      this.otherRequirements().forEach(req => {
        if (!grouped[req.team_name!]) {
          grouped[req.team_name!] = [];
        }
        grouped[req.team_name!].push(req);
      });

    return Object.keys(grouped).map(team_name => ({
        team_name,
        requirements: grouped[team_name]
      }));
    }

  getRequirementsMapListObject() {
    this.rowsReq = this.getRequirementsByPhase(this.phase).map(req => ({
      document_type: req.document_type_name,
      requirement_uuid: req.uuid,
      description: req.description,
      link: req.specification_link,
      wait_time: req.estimated_wait_time,
      owner_team: req.owner_team_name,
      owner_team_uuid: req.owner_team_uuid,
    }));
    this.temp = [...this.rowsReq];
  }

  deleteRequirement(uuid: String) {
    this.requirementService.deleteRequirement(uuid).subscribe(() => {
      this.requirementService.getRequirementsWithDocument_types(this.team()!.uuid.toString()).subscribe((requirements: RequirementDocument_type[]) => {
        this.requirements = requirements;
        this.getRequirementsMapListObject();
      })

    });
  }

  navigateToTeam(team_uuid: string) {
    this.router.navigate(['/org/team', team_uuid]);
  }

  updateRequirementFilter(event: any) {
    const val = event.target.value.toLowerCase();
    let templocal: any[] = [];
    switch (this.filterFormReq.value.filter) {
      case 'document_type':
        templocal = this.temp.filter(function (d) {
          return d.document_type.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'description':
        templocal = this.temp.filter(function (d) {
          return d.description.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'link':
        templocal = this.temp.filter(function (d) {
          return d.link.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'wait_time':
        templocal = this.temp.filter(function (d) {
          return d.wait_time.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
      case 'owner_team':
        templocal = this.temp.filter(function (d) {
          return d.owner_team.toLowerCase().indexOf(val) !== -1 || !val;
        });
        break;
    }
    this.rowsReq = templocal;
    // Whenever the filter changes, always go back to the first page
    this.table!.offset = 0;

  }

  reloadTable(){
    this.table?.recalculate();
  }
  protected readonly ColumnMode = ColumnMode;
}
