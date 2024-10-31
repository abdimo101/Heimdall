import {Application} from "../interfaces/Application";
import {HttpErrorResponse} from "@angular/common/http";
import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {debounceTime, pipe, switchMap, tap} from "rxjs";
import {inject} from "@angular/core";
import {ApplicationService} from "../services/application.service";
import {tapResponse} from "@ngrx/operators";
import {ApplicationHistory} from "../interfaces/Application.history.interface";


interface ApplicationState {
  application: Application | null;
  applicationIsLoading: boolean;
  applicationError: HttpErrorResponse | null;
  applicationHistory: ApplicationHistory[] | null;
  applicationHistoryIsLoading: boolean;
  applicationHistoryError: HttpErrorResponse | null;
}

const initialState: ApplicationState = {
  application: null,
  applicationIsLoading: false,
  applicationError: null,
  applicationHistory: null,
  applicationHistoryIsLoading: false,
  applicationHistoryError: null,
}

export const ApplicationStore = signalStore(
  withState(initialState),
  withMethods((store, applicationService = inject(ApplicationService)) => ({
    fetchApplication: rxMethod<string>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {applicationIsLoading: true})),
        switchMap((applicationUuid) => applicationService.getSingleApplication(applicationUuid).pipe(
          tapResponse({
            next: (application) => {
              patchState(store, {
                application: application,
                applicationError: null,
              });
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                application: null,
                applicationError: error,
              });
            },
            finalize: () => {
              patchState(store, {applicationIsLoading: false});
            }
          })
        ))
      )
    ),
    fetchApplicationHistory: rxMethod<string>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {applicationHistoryIsLoading: true})),
        switchMap((applicationUuid) => applicationService.getApplicationHistory(applicationUuid).pipe(
          tapResponse({
            next: (applicationHistory) => {
              patchState(store, {
                applicationHistory: applicationHistory,
                applicationHistoryError: null,
              });
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                applicationHistory: [],
                applicationHistoryError: error,
              });
            },
            finalize: () => {
              patchState(store, {applicationHistoryIsLoading: false});
            }
          })
        ))
      )
    ),
  }))
);

