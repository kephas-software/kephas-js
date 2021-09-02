import { ReturnUrlType } from "./authentication.settings";

export interface NavigationState {
  [ReturnUrlType]: string;
}
