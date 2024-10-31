import {signalStore, withState} from "@ngrx/signals";


interface SettingsState {
  redirectDelay: number;
}

const initialState: SettingsState = {
  redirectDelay: 2000,
};

export const SettingsStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
);
