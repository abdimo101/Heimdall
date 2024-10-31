import {Component, inject, signal, Signal, effect, WritableSignal, computed} from '@angular/core';
import {CardComponent} from "../card/card.component";
import {v4 as uuidv4} from 'uuid';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ApplicationService} from "../../services/application.service";
import {ApplicationDetails} from "../../interfaces/ApplicationDetails";
import {KeycloakService} from "../../services/keycloak.service";
import {AsyncPipe, JsonPipe, NgClass, NgOptimizedImage, DatePipe} from "@angular/common";
import {Document} from "../../interfaces/document";
import {CapitalizeFirstPipe} from "../../pipes/capitalize-first.pipe";
import {DocumentService} from "../../services/document.service";
import { NotificationService } from '../../services/notification.service';
import {Document_typeService} from "../../services/document_type.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Phase} from "../../interfaces/phase";
import {PhaseService} from "../../services/phase.service";
import {Document_typePickerComponent} from "../team/requirement/document_type-picker/document_type-picker.component";
import {Document_type} from "../../interfaces/document_type";
import { Task } from '../../interfaces/Task';
import {MissingApprovalsModalComponent} from "./missing-approvals-modal/missing-approvals-modal.component";
import {ApplicationLifecycleVisualizationComponent} from "./application-lifecycle-visualization.component";
import {FlexCardComponent} from "../common/flex-card.component";
import {ApplicationStore} from "../../stores/application.store";
import {Setting_TTLService} from "../../services/setting_ttl.service";
import { TTLDisplay } from '../../interfaces/TTLDisplay';
import {DocumentsComponent} from "./documents/documents.component";
import {PhaseStore} from "../../stores/phase.store";
import {NotificationStore} from "../../stores/notification.store";



@Component({
  selector: 'app-application',
  standalone: true,
  providers: [ApplicationStore],
  imports: [
    CardComponent,
    AsyncPipe,
    JsonPipe,
    CapitalizeFirstPipe,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    Document_typePickerComponent,
    NgOptimizedImage,
    MissingApprovalsModalComponent,
    ApplicationLifecycleVisualizationComponent,
    FlexCardComponent,
    DatePipe,
    DocumentsComponent,
    NgClass
  ],
  styles: `
    .grid {
      grid-template-rows: minmax(0, auto);
    }
  `,
  template:`
    <div class="grid grid-cols-2 xl:grid-cols-3 w-full gap-5">
      <!-- Title -->
      <div class="col-span-full">
        <h1 class="text-center text-4xl font-bold text-gray-800">{{ this.application()?.name }}</h1>
      </div>


              <app-flex-card
                class="col-span-2 row-span-1 xl:min-w-[640px] min-h-[300px]"
                [heading]="'Description'">
                {{this.application()?.description || 'No description available'}}
              </app-flex-card>





          <!-- Vertical Card Container -->
            <app-flex-card
              [heading]="application()?.name + ' information' || 'ApplicationDetails Title'"
              class="col-span-2 xl:col-span-1 row-span-2 xl:min-w-[320px] min-h-[300px]">
              <div class="flex flex-col">

                <div><strong>App version:</strong> {{ this.application()?.version }}</div>
                <div class="mt-2"><strong>App Phase:</strong> {{ this.application()?.phase_name }}</div>
                <div class="mt-2"><strong>Next Phase:</strong> {{ getNextPhaseName() }}</div>
                <div class='mt-2 hover:bg-gray-100 cursor-pointer' (click)="navigateToUser(application()?.po_id)">
                  <strong>PO:</strong> {{ this.application()?.po_name ?? 'N/A' }}
                </div>
                <div class='mt-2 hover:bg-gray-100 cursor-pointer' (click)="navigateToUser(application()?.pm_id)">
                  <strong>PM:</strong> {{ this.application()?.pm_name ?? 'N/A' }}
                </div>
                @for (team of application()?.teams; track team.uuid) {
                  <div class="mt-2">
                    <a [routerLink]="['/org/team', team.uuid]"><strong>{{ team.name }}: </strong></a>
                    <a [routerLink]="['/org/user', team.responsible_user]">{{ team.responsible_user_name ?? 'N/A' }}</a>
                  </div>
                }
              </div>
              @if (this.application()?.next_phase_uuid !== null) {
                <div class="flex">
                  <button class="mt-4 btn btn-gray-custom" [disabled]="!canTransition()" (click)="finalizeTransition()">
                    Finalize Transition
                  </button>
                  <span class="absolute left-1/2 transform -translate-x-1/2 -top-8 bg-gray-700 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
    Approve all required documents to Finalize Transition
  </span>
                  <button class="mt-4 btn btn-gray-custom ml-4" (click)="cancelTransition()">Cancel Transition</button>
                </div>
              } @else {
                <div class="flex">
                  <button class="mt-4 btn btn-gray-custom" [disabled]="!canTransition()"
                          (click)="toggleShowTransitionModal()">Initiate
                    Transition
                  </button>
                </div>
              }
            </app-flex-card>


      <app-flex-card class="w-full xl:min-w-[640px] min-h-[300px] max-h-[620px] col-span-2 row-span-1">
        <app-application-lifecycle-visualization [applicationId]="applicationUuid"/>
      </app-flex-card>


          <!-- Required Actions Card -->
          <app-card
            [imageUrl]="'https://via.placeholder.com/600x475'"
            [additionalStyles]="'hover:bg-gray-100 transition-colors duration-300'"
            class="col-span-full cursor-pointer" (click)="setShowAllActions(!showAllActions())">
            <h2 class="text-lg font-semibold mb-4">Required Actions ({{ this.uncompletedTasks() }})</h2>
            @if (showAllActions()) {
              @for (task of this.application()?.tasks; track task.uuid) {
                @if (task.status !== 'completed' && task.target_table === 'document') {
                  <div class="mt-2">{{ task.description }}</div>
                }
              }
            }
          </app-card>

        <div
          class="col-span-full bg-white border border-gray-300 rounded-lg shadow-md" [ngClass]="showDocuments ? '' : 'hover:bg-gray-100 transition-colors duration-300 '">
          <div class="flex items-end p-6 mb-2 cursor-pointer" (click)="toggleDocuments()">
            <h2 class="text-lg font-semibold">Documents</h2>
          </div>
          @if (showDocuments) {
            <app-documents
            [application]="this.application">
            </app-documents>
          }
        </div>

    </div>
    @if (showTransitionModal()) {

      <div class="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40">

        <div class="flex flex-col items-center bg-gray-800 w-1/3 rounded-t-lg">
          <div class="mt-4 mb-4">
            <h3 class="text-white">Change Phase</h3>
          </div>
          <div [formGroup]="transitionForm" class="flex flex-col w-9/12">
            <div class="flex mb-4">
              <label for="next_phase" class="text-white mr-2 whitespace-nowrap ">Next phase:</label>
              <select formControlName="next_phase" id="next_phase" class="pl-1 h-[28px] rounded w-8/12 flex-1">
                <option value="" disabled selected>Select Phase</option>
                @for (phase of phases(); track phase.uuid) {
                  <option value="{{phase.uuid}}">{{ phase.name }}</option>
                }
              </select>
            </div>
          </div>
        </div>
        <div class="flex justify-center bg-gray-700 w-1/3 rounded-b-lg">
          <div class="flex justify-center mt-4 mb-4">
            <button class="btn-gray-custom" [disabled]="transitionForm.invalid"
                    (click)="initiateTransitionButton(); $event.stopPropagation()">Initiate Transition
            </button>
            <button class="btn-gray-custom ml-4" (click)="toggleShowTransitionModal(); $event.stopPropagation()">
              Cancel
            </button>
          </div>
        </div>
      </div>
    }

  `,
})
export class ApplicationComponent {
  protected readonly applicationStore = inject(ApplicationStore);

  applicationUuid: string = '';
  phaseStore = inject(PhaseStore);
  application: WritableSignal<ApplicationDetails | undefined> = signal(undefined);
  showTransitionModal: WritableSignal<boolean> = signal(false);
  showAllActions = signal(false);
  uncompletedTasks: Signal<number> = computed(() => this.application()?.tasks?.filter(task => task.status !== 'completed' && task.target_table === 'document').length || 0);
  applicationService = inject(ApplicationService)
  documentService = inject(DocumentService);
  phaseService = inject(PhaseService);
  phases: WritableSignal<Phase[] | undefined> = signal(undefined);
  documentTypeService = inject(Document_typeService);
  keycloak = inject(KeycloakService)
  notificationService = inject(NotificationService);
  showDocuments = false;
  missingDocuments: String[] | undefined;
  setting_ttlService = inject(Setting_TTLService);
  ttl: TTLDisplay | undefined = undefined;
  canTransition = signal(false)
  notificationStore = inject(NotificationStore);


  noneApprovedDocuments: Document[] = [];
  transitionForm = new FormGroup({
    next_phase: new FormControl('', Validators.required)
  });


  constructor(private router: Router, private route: ActivatedRoute) {
    this.applicationUuid = this.route.snapshot.paramMap.get('uuid') || '';
  }
   initiate = effect(() => {
     if (this.application()) {
       this.checkInitiateTransition();
     }
  })


  ngOnInit() {
    this.applicationService.getSingleApplicationDetails(this.applicationUuid).subscribe({
      next: (application: ApplicationDetails) => {
          this.application.set(application);
          if(application.documents){
            this.loadDocumentsTTL(application.documents);
          }
      },
        error: (error) => {
        console.log(error);
      }
    });
    this.phaseService.getAllPhases().subscribe({
      next: (phases) => {
        this.phases.set(phases);
          this.phases.set(this.phases()!.sort((a, b) => a.order_number! - b.order_number!));
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  setShowAllActions(boolean: boolean) {
    this.showAllActions.set(boolean);
  }

  toggleDocuments() {
    this.showDocuments = !this.showDocuments;
  }

  initiateTransitionButton() {
    this.initiateTransition();
    this.toggleShowTransitionModal()
  }

  checkInitiateTransition() {
    this.documentTypeService.missingDocuments(this.application()!.uuid, this.application()!.phase_uuid!).subscribe({
      next: (response) => {
        this.missingDocuments = response;
        if (this.missingDocuments.length === 0) {
          if(this.application()?.next_phase_uuid !== null)
          {
            this.documentService.documentsApprovalCheck(this.application()!.uuid, this.application()!.phase_uuid!).subscribe({
              next: (response: Document[]) => {
                this.noneApprovedDocuments = response
                this.canTransition.set(this.noneApprovedDocuments.length === 0)
              },
              error: (error) => {
                console.log(error);
              }
            });
          } else {
            this.canTransition.set(true);
          }
        } else {

          this.canTransition.set(false);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  toggleShowTransitionModal() {
    this.showTransitionModal.set(!this.showTransitionModal());
  }



  cancelTransition() {
    this.transitionForm.get('next_phase')?.setValue(this.application()?.phase_uuid?.toString() || null);
    this.initiateTransition();
  }

  finalizeTransition() {
    this.transitionForm.get('next_phase')?.setValue(this.application()?.next_phase_uuid?.toString() || null);
    this.initiateTransition();
  }

  initiateTransition() {
    this.applicationService.changePhase(this.application()!.uuid, this.transitionForm.get('next_phase')?.value!).subscribe({
      next: (response) => {
        this.applicationService.getSingleApplicationDetails(this.applicationUuid).subscribe({
          next: (application: ApplicationDetails) => {
            if (application) {
              this.application.set(application);
              this.notificationService.getNotifications();
              this.applicationStore.fetchApplication(this.applicationUuid);
              this.applicationStore.fetchApplicationHistory(this.applicationUuid);
              setTimeout(() => {
                console.log("vi kører det pjat")
                this.notificationStore.fetchNotifications();
              },2000);
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }



  navigateToUser(userUuid: string | undefined) {
    if (userUuid) {
      this.router.navigate(['/org/user', userUuid]);
    }
  }

  getNextPhaseName(): string {
    const nextPhaseUuid = this.application()?.next_phase_uuid;
    if (!nextPhaseUuid || !this.phases()) {
      return 'Not in transition';
    }
    const nextPhase = this.phases()!.find(phase => phase.uuid === nextPhaseUuid);
    return nextPhase ? nextPhase.name!.toString() : 'Not in transition';
  }



  getTTLDisplay(documentUuid: String, document: any) {
    this.setting_ttlService.TTLDisplay(documentUuid).subscribe({
      next: (response: TTLDisplay) => {
        document.ttl = response.ttl;
        console.log("TTL: " + response.ttl);
      },
      error: (error) => {
        console.log(error);
      }
    });
    }

  loadDocumentsTTL(documents: any[]) {
  console.log("Loading TTL for documents");
  documents.forEach((document) => {
    this.getTTLDisplay(document.uuid, document);
  });
}

}

