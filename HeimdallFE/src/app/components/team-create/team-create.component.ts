import {Component, effect, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TeamType} from "../../enums/TeamType.enum";
import {User} from "../../interfaces/User.interface";
import {UserPickerComponent} from "../user/user-picker/user-picker.component";
import {NgClass, NgIf} from "@angular/common";
import {Team} from "../../interfaces/Team.interface";
import {v4 as uuidv4} from 'uuid';
import {TeamStore} from "../../stores/team.store";
import {Router} from "@angular/router";
import {SettingsStore} from "../../stores/global/settings.store";
import {SpinnerComponent} from "../common/spinner.component";

@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UserPickerComponent,
    NgIf,
    SpinnerComponent,
    NgClass
  ],
  providers: [TeamStore],
  template: `
    <div class="flex flex-col">
      <div class="flex justify-center p-2 mb-4">
        <p class="text-2xl">Create Team</p>
      </div>
      <form [formGroup]="createTeamForm" (ngSubmit)="onSubmit($event)"
            class="flex flex-col justify-center items-center">
        <div class="flex flex-col w-2/3 ">
          <div class="flex flex-col w-full">
            <div class="flex mt-4 items-center">
              <p class="mr-2 w-44">Type:</p>
              <select formControlName="teamType" id="teamType"
                      class="select select-bordered border-gray-300 bg-white w-full max-w-xs">
                <!-- Use TeamType enum for options -->
                <option value="{{TeamType.DEVOPS}}">DevOps</option>
                <option value="{{TeamType.ENTERPRISE_ARCHITECT}}">Enterprise Architect</option>
                <option value="{{TeamType.OPERATIONS}}">Operations</option>
                <option value="{{TeamType.SECURITY}}">Security</option>
                <option value="{{TeamType.SUPPORT}}">Support</option>
                <option value="{{TeamType.TEST}}">Test</option>
              </select>
            </div>
            <div class="flex mt-4 items-center">
              <p class="mr-2 w-44">Name:</p>
              <input type="text" formControlName="teamName" placeholder="Team name"
                     class="p-2 border border-gray-300 rounded flex-1">
            </div>
            <div class="flex mt-4 items-center">
              <p class="mr-2 w-44">Description:</p>
              <textarea formControlName="teamDescription" placeholder="Description"
                        class="p-2 border border-gray-300 rounded flex-1 resize-y">
          </textarea>
            </div>
            <div class="flex mt-4 items-center">
              <p class="mr-2 w-44">SPOC:</p>
              <div class="rounded flex-1">
                @if (showSPOCPicker()) {
                  <app-user-picker (showSignal)="showSPOCPicker.set($event)"
                                   (userEmitter)="handleSPOCPicked($event)"></app-user-picker>
                } @else {
                  <input type="text" readonly placeholder="SPOC" (click)="pickSPOC()"
                         [value]="createTeamForm.get('teamSPOC')?.value?.id ? createTeamForm.get('teamSPOC')?.value?.name + ' - ' + createTeamForm.get('teamSPOC')?.value?.email : ''"
                         class="p-2 border border-gray-300 rounded flex-1 w-full">
                }
              </div>
            </div>
            <div class="flex justify-center mt-4">
              <button type="submit" [disabled]="createTeamForm.invalid || createdTeamIsLoading() || createdTeam()"
                      (click)="onSubmit($event)"
                      class="btn btn-gray-custom w-40 content-center"
                      [ngClass]="createdTeam() ? 'disabled:bg-success' : ''">
                @if (this.createdTeamIsLoading()) {
                  <app-spinner/>
                } @else {
                  {{ this.createdTeam() ? 'Team Created' : 'Create Team' }}
                }
              </button>
            </div>
          </div>
          <div class="flex flex-col mt-4 w-full">
            <div class="w-full">
              @if (showMemberPicker()) {
                <app-user-picker (showSignal)="showMemberPicker.set($event)"
                                 (userEmitter)="handleMemberPicked($event)"></app-user-picker>
              } @else {
                <input type="text" readonly placeholder="Add member" (click)="pickMember()"
                       class="p-2 border border-gray-300 rounded flex-1 w-full">
              }
            </div>
            <div class="flex flex-col items-center w-full mt-4 p-2 border">
              <h2>Members: </h2>
              @for (member of createTeamForm.get('teamMembers')?.value; track member.id) {
                <div class="flex flex-row justify-between mt-4 p-2 w-full border bg-white">
                  <div class="flex flex-col">
                    <p>{{ member.name }}</p>
                    <p>{{ member.email }}</p>
                  </div>
                  <div>
                    <button type="button" class="btn w-fit text-2xl text-red-600"
                            (click)="removeTeamMember(member)">❌
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </form>
    </div>
  `
})
export class TeamCreateComponent {
  protected readonly teamStore = inject(TeamStore);
  protected readonly settingsStore = inject(SettingsStore);
  protected readonly createdTeamIsLoading = inject(TeamStore).createdTeamIsLoading;
  protected readonly createdTeam = inject(TeamStore).createdTeam;
  createTeamForm: FormGroup;

  onSubmit(event: Event) {
    event.preventDefault();
    this.teamStore.createTeam(this.prepareTeamData());
  }

  teamCreatedEffect = effect(() => {
    if(this.teamStore.createdTeam()) {
      setTimeout(() => {
        let createdTeamUuid = this.teamStore.createdTeam()?.uuid;
        if(!createdTeamUuid) return;
        this.router.navigate(['org/team/' + createdTeamUuid]);
      }, this.settingsStore.redirectDelay());
    }
  });

  prepareTeamData(): Team {
    return {
      uuid: this.createTeamForm.value.teamUuid,
      name: this.createTeamForm.value.teamName,
      type: this.createTeamForm.value.teamType,
      description: this.createTeamForm.value.teamDescription,
      spoc: this.createTeamForm.value.teamSPOC?.id,
      members: this.createTeamForm.value.teamMembers.map((member: User) => member.id)
    };
  }

  constructor(private router: Router) {
    this.createTeamForm = new FormGroup({
      teamUuid: new FormControl(uuidv4()),
      teamType: new FormControl('', Validators.required),
      teamName: new FormControl('', Validators.required),
      teamDescription: new FormControl(''),
      teamSPOC: new FormControl(null as User | null),
      teamMembers: new FormControl([] as User[])
    })

  }

  protected readonly TeamType = TeamType;
  showSPOCPicker = signal(false);
  showMemberPicker = signal(false);

  pickSPOC() {
    this.showSPOCPicker.set(true);
  }

  pickMember() {
    this.showMemberPicker.set(true);
  }

  handleSPOCPicked(user: User) {
    this.createTeamForm.get('teamSPOC')?.setValue(user);
    this.addTeamMember(user);
  }

  handleMemberPicked(user: User) {
    this.addTeamMember(user);
  }

  addTeamMember(user: User) {
    const teamMembers = this.createTeamForm.get('teamMembers')?.value;
    if (teamMembers.find((member: User) => member.id === user.id)) return;
    teamMembers.push(user);
    this.createTeamForm.get('teamMembers')?.setValue(teamMembers);
  }

  removeTeamMember(user: User) {
    const teamMembers = this.createTeamForm.get('teamMembers')?.value;
    const filteredTeamMembers = teamMembers.filter((teamMember: User) => teamMember.id !== user.id);
    this.createTeamForm.get('teamMembers')?.setValue(filteredTeamMembers);
    if (this.createTeamForm.get('teamSPOC')?.value?.id === user.id) {
      this.createTeamForm.get('teamSPOC')?.setValue(null);
    }
  }

}

