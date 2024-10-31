import {Component, inject, signal, ViewChild} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Team} from '../../interfaces/Team.interface';
import {TeamService} from "../../services/team.service";
import {ApplicationService} from "../../services/application.service";
import {PopupNoticeComponent} from "../popup-notice/popup-notice.component";
import {Application} from '../../interfaces/Application';
import {CommonModule} from '@angular/common';
import {User} from "../../interfaces/User.interface";
import {UserPickerComponent} from "../user/user-picker/user-picker.component";
import {KeycloakService} from "../../services/keycloak.service";
import {UserService} from "../../services/user.service";
import {Phase} from "../../interfaces/phase";
import {PhaseService} from "../../services/phase.service";

@Component({
  selector: 'app-application-setup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PopupNoticeComponent,
    CommonModule,
    UserPickerComponent
  ],
  templateUrl: './application-setup.component.html'
})
export class ApplicationSetupComponent {
  @ViewChild(PopupNoticeComponent) notification!: PopupNoticeComponent;
  uuid = '';
  pickedApplicationTeamUuid = '';
  teams = <Team[]>([]);
  phaseService = inject(PhaseService);
  phases: Phase[] | undefined;
  teamService = inject(TeamService)
  applicationService = inject(ApplicationService)
  showExtraDetails = false;
  currentModal: string = '';
  keycloakService = inject(KeycloakService);
  userService = inject(UserService);
  currentUser: User | undefined;

  toggleExtraDetails() {
    this.showExtraDetails = !this.showExtraDetails;
  }

  toggleModal(modal: string) {
    if (this.currentModal === modal) {
      this.currentModal = '';
    } else {
      this.currentModal = modal; // Open the new modal
    }
  }

  showPOPicker = signal(false);
  showPMPicker = signal(false);

  constructor() {
    this.uuid = uuidv4();
  }

  ngOnInit(): void {


    this.userService.getUserByEmail(this.keycloakService.getEmail()).subscribe({
      next: (response: User) => {
        this.currentUser = response;
        this.getTeams(this.currentUser?.organization_uuid);

      },
      error: (error) => {
        console.log(error);
      }
    })
    this.phaseService.getAllPhases().subscribe({
      next: (response: Phase[]) => {
        this.phases = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getTeams(uuid: string): void {
    this.teamService.getAllTeamsByOrganizationUuid(uuid).subscribe({
      next: (response: Team[]) => {
        this.teams = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  onTeamSelect(event: Event): void {
    this.pickedApplicationTeamUuid = (event.target as HTMLSelectElement).value;
  }

  createApplicationForm = new FormGroup({
    appName: new FormControl('', Validators.required),
    appKey: new FormControl('', Validators.required),
    appVersion: new FormControl(''),
    appPhase: new FormControl(''),
    whoAreYou: new FormControl('product owner'),
    productOwner: new FormControl(null as User | null),
    productManager: new FormControl(null as User | null),
    description: new FormControl('', Validators.required),
    applicationTeam: new FormControl(''),
    securityTeam: new FormControl(''),
    testTeam: new FormControl(''),
    supportTeam: new FormControl(''),
    operationTeam: new FormControl(''),
    enterpriseArchitectTeam: new FormControl(''),
    devopsTeam: new FormControl('')
  });

  handleCreate() {
    let teamsUuids: string[] = this.teams.map(team => team.uuid);
    let createdApplication: Application = {
      uuid: this.uuid,
      // TODO: organization_uuid should be applied server side
      organization_uuid: "ace2e137-d6e7-4476-9bc4-5c7a23c17ddd",
      app_key: this.createApplicationForm.get('appKey')?.value || '',
      name: this.createApplicationForm.get('appName')?.value || '',
      version: this.createApplicationForm.get('appVersion')?.value || '',
      phase_uuid: this.createApplicationForm.get('appPhase')?.value || '',
      description: this.createApplicationForm.get('description')?.value || '',
      teams: teamsUuids
    };

    const poUuid = this.createApplicationForm.get('productOwner')?.value?.id;
    const pmUuid = this.createApplicationForm.get('productManager')?.value?.id;
    if(this.currentUser)
    {
      if(this.createApplicationForm.get('whoAreYou')?.value === 'product owner')
      {

        createdApplication.po = this.currentUser?.id;
        createdApplication.pm = pmUuid;
      }
      else if(this.createApplicationForm.get('whoAreYou')?.value === 'product manager')
      {
        createdApplication.pm = this.currentUser?.id;
        createdApplication.po = poUuid;
      }
      else{
        createdApplication.po = poUuid;
        createdApplication.pm = pmUuid;
      }
    }


    createdApplication = this.removeEmptyProperties(createdApplication);

    this.applicationService.CreateOrUpdateApplication(createdApplication).subscribe({
      next: (response) => {
        this.notification.display('Application Created Successfully');
        this.resetForm()
      },
      error: (error) => {
        this.notification.display('Error Creating Application');
        console.log(error);
      }
    })
  }

  removeEmptyProperties(obj: any): any {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v !== ''));
  }

  setProductOwner(user: User) {
    this.createApplicationForm.get('productOwner')?.setValue(user);
  }

  setProductManager(user: User) {
    this.createApplicationForm.get('productManager')?.setValue(user);
  }

  resetForm() {
    this.createApplicationForm.setValue({
      appName: '',
      appKey: '',
      appVersion: '',
      appPhase: '',
      whoAreYou: 'product owner',
      productOwner: null,
      productManager: null,
      description: '',
      applicationTeam: '',
      securityTeam: '',
      testTeam: '',
      supportTeam: '',
      operationTeam: '',
      enterpriseArchitectTeam: '',
      devopsTeam: ''
    });
    this.uuid = uuidv4();
  }
}
