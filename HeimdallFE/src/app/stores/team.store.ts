import {Team} from "../interfaces/Team.interface";
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {TeamService} from "../services/team.service";
import {computed, inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from "rxjs";
import {tapResponse} from "@ngrx/operators";
import {SessionStore} from "./global/session.store";
import {HttpErrorResponse} from "@angular/common/http";

type TeamState = {
  teams: Team[] | null;
  teamsIsLoading: boolean;
  teamsError: HttpErrorResponse | null;
  createdTeam: Team | null;
  createdTeamIsLoading: boolean;
  createdTeamError: HttpErrorResponse | null;
}

const initialState: TeamState = {
  teams: null,
  teamsIsLoading: false,
  teamsError: null,
  createdTeam: null,
  createdTeamIsLoading: false,
  createdTeamError: null,
}

export const TeamStore = signalStore(
  withState(initialState),
  withMethods((store, teamService = inject(TeamService), sessionStore = inject(SessionStore)) => ({
    createTeam: rxMethod<Team>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {
          createdTeamIsLoading: true,
          createdTeamError: null,
        })),
        switchMap((team: Team) => teamService.createTeam(team).pipe(
          tapResponse({
            next: (createdTeam) => {
              patchState(store, {
                createdTeam: createdTeam,
                createdTeamError: null,
              });
              sessionStore.fetchAllTeams();
              if(team.members?.includes(sessionStore.user()!.id)) {
                sessionStore.fetchUserTeams();
              }
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                createdTeam: null,
                createdTeamError: error,
              });
            },
            finalize: () => {
              patchState(store, {createdTeamIsLoading: false});
            }
          })
        )),
      )
    )
  })),
);
