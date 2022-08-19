import { action, computed, makeObservable, observable } from "mobx";
import Base, { Mode, State } from "@/stores/base";
import Logger from "@/utils/logger";

export enum AuthStatus {
  Initial,
  Unauthorized,
  Authorized,
  NeedsAcceptTerms,
}

export default class AuthStore extends Base {
  @observable
  public authStatus!: AuthStatus;

  constructor() {
    super();
    makeObservable(this);
    this.setAuthStatus(AuthStatus.Initial);
  }

  @action
  public setAuthStatus(status: AuthStatus) {
    Logger.info("AuthStore", "authStatus set:", status);
    this.authStatus = status;
  }
}
