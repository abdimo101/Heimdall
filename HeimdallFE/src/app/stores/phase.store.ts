import {HttpErrorResponse} from "@angular/common/http";
import {Phase} from "../interfaces/phase";
import {patchState, signalStore, withHooks, withMethods, withState} from "@ngrx/signals";
import {PhaseService} from "../services/phase.service";
import {inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {debounceTime, pipe, switchMap, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";

interface PhaseState {
  phases: Phase[];
  phasesIsLoading: boolean;
  phasesError: HttpErrorResponse | null;
}

const initialState: PhaseState = {
  phases: [],
  phasesIsLoading: false,
  phasesError: null,
}

export const PhaseStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store, phaseService = inject(PhaseService)) => ({
    fetchPhases: rxMethod<void>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {phasesIsLoading: true})),
        switchMap(() => phaseService.getAllPhases().pipe(
          tapResponse({
            next: (phases) => {
              patchState(store, {
                phases: phases,
                phasesError: null,
              });
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                phases: [],
                phasesError: error,
              });
            },
            finalize: () => {
              patchState(store, {phasesIsLoading: false});
            }
          })
        ))
      ),
    )
  })),
  withHooks({
    onInit(store) {
      store.fetchPhases();
    }
  }),
);
