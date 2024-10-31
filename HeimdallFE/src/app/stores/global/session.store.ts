import {User} from "../../interfaces/User.interface";
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from "@ngrx/signals";
import {UserService} from "../../services/user.service";
import {computed, inject} from "@angular/core";
import {rxMethod} from "@ngrx/signals/rxjs-interop";
import {tapResponse} from '@ngrx/operators';
import {debounceTime, pipe, switchMap, tap} from "rxjs";
import {Organization} from "../../interfaces/organization.interface";
import {OrganizationService} from "../../services/organization.service";
import {Team} from "../../interfaces/Team.interface";
import {TeamService} from "../../services/team.service";
import {HttpErrorResponse} from "@angular/common/http";

interface SessionState {
  user: User | null;
  userIsLoading: boolean;
  userError: HttpErrorResponse | null;
  userOrganization: Organization | null;
  userOrganizationIsLoading: boolean;
  userOrganizationError: HttpErrorResponse | null;
  userTeams: Team[] | null;
  userTeamsIsLoading: boolean;
  userTeamsError: HttpErrorResponse | null;
  allTeams: Team[] | null;
  allTeamsIsLoading: boolean;
  allTeamsError: HttpErrorResponse | null;
};

const initialState: SessionState = {
  user: null,
  userIsLoading: false,
  userError: null,
  userOrganization: null,
  userOrganizationIsLoading: false,
  userOrganizationError: null,
  userTeams: null,
  userTeamsIsLoading: false,
  userTeamsError: null,
  allTeams: null,
  allTeamsIsLoading: false,
  allTeamsError: null,
};

export const SessionStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed((state) => ({
    initialized: computed(() => (
      state.user() &&
      state.userOrganization()
    )),
  })),
  withMethods((store, userService = inject(UserService)) => ({
    fetchUser: rxMethod<void>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {userIsLoading: true})),
        switchMap(() => userService.getOwnUser().pipe(
          tapResponse({
            next: (user) => {
              patchState(store, {
                user: user,
                userIsLoading: false,
                userError: null,
              })
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                userIsLoading: false,
                userError: error,
              });
            },
            finalize: () => {
              patchState(store, {
                userIsLoading: false,
              });
            },
          })
        ))
      )
    ),
  })),
  withMethods((store, organizationService = inject(OrganizationService)) => ({
    fetchUserOrganization: rxMethod<void>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {userOrganizationIsLoading: true})),
        switchMap(() => organizationService.getOwnOrganization().pipe(
          tapResponse({
            next: (organization) => patchState(store, {
              userOrganization: organization,
              userOrganizationError: null,
            }),
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                userOrganizationError: error,
              });
            },
            finalize: () => {
              patchState(store, {
                userOrganizationIsLoading: false,
              });
            },
          })
        ))
      )
    ),
  })),
  withMethods((store, teamService = inject(TeamService)) => ({
    fetchUserTeams: rxMethod<void>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {userTeamsIsLoading: true})),
        switchMap(() => teamService.getOwnTeams().pipe(
          tapResponse({
            next: (teams) => {
              patchState(store, {
                userTeams: teams,
                userTeamsError: null,
              })
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                userTeamsError: error,
              });
            },
            finalize: () => {
              patchState(store, {
                userTeamsIsLoading: false
              });
            },
          })
        ))
      )
    ),
    fetchAllTeams: rxMethod<void>(
      pipe(
        debounceTime(300),
        tap(() => patchState(store, {allTeamsIsLoading: true})),
        switchMap(() => teamService.getTeams().pipe(
          tapResponse({
            next: (teams) => {
              patchState(store, {
                allTeams: teams,
                allTeamsError: null,
              })
            },
            error: (error: HttpErrorResponse) => {
              patchState(store, {
                allTeamsError: error,
              });
            },
            finalize: () => {
              patchState(store, {
                allTeamsIsLoading: false,
              });
            },
          })
        ))
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.fetchUser();
      store.fetchUserOrganization();
      store.fetchUserTeams();
      store.fetchAllTeams();
    },
  }),
);
