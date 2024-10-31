import {patchState, signalStore, withMethods, withState} from "@ngrx/signals";

interface UiState {
  sidebarOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
};

export const UiStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withMethods((store) => ({
    toggleSidebar() {
      patchState(store, {sidebarOpen: !store.sidebarOpen()});
    },
  }))
);
