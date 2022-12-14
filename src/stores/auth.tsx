import { action, makeObservable, observable } from "mobx";
import Base, { State } from "@/stores/base";
import Logger from "@/utils/logger";
import ky from "ky";
import { User } from "@/interfaces/nature";

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
    Logger.debug("AuthStore", "authStatus set:", status);
    this.authStatus = status;
  }

  @action
  public async checkAuth() {
    if (!this.fetchable) {
      return this.setAuthStatus(AuthStatus.Unauthorized);
    }

    this.setState(State.RUNNING);
    try {
      const res = await ky.get(this.apiUrl("1/users/me"), { headers: this.generateFetchHeader() });
      const data = await res.json<User>();
      if (!res.ok || !data.id) {
        throw new Error();
      }
      this.setAuthStatus(AuthStatus.Authorized);
      return this.setState(State.DONE);
    } catch (e) {
      this.setAuthStatus(AuthStatus.Unauthorized);

      return this.setState(State.ERROR);
    }
  }

  @action
  public async login(accessToken: string, useLocalStorage: boolean) {
    sessionStorage.accessToken = accessToken;
    await this.checkAuth();
    if (this.authStatus !== AuthStatus.Authorized) {
      this.tryEnqueueSnackbar("認証エラー");
      return this.logout();
    }
    if (useLocalStorage) {
      localStorage.accessToken = accessToken;
    }
  }

  @action
  public async logout() {
    delete sessionStorage.accessToken;
    delete localStorage.accessToken;
    this.setAuthStatus(AuthStatus.Unauthorized);
  }
}
