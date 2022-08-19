import { action, observable } from "mobx";
import ToastStore from "./toast";
import LoadingStore from "./loading";

export enum State {
  IDLE,
  RUNNING,
  DONE,
  ERROR,
}

export enum Mode {
  NONE,
  GET,
  SEARCH,
  CREATE,
  UPDATE,
  DELETE,
  ACTIVATE,
  LOGIN,
  LOGOUT,
  IMPORT,
}

export interface IModel {
  _id: string;
  _created: string;
  _modified: string;
}

export interface IPaginate {
  current: number;
  perPage: number;
  recordsOnPage: number;
  totalPages: number;
  totalRecords: number;
}

export default class Base {
  constructor() {
    this.state = State.IDLE;
    this.mode = Mode.NONE;
  }

  @observable
  public state: State;

  @observable
  public mode: Mode;

  @action.bound
  public setState(state: State) {
    this.state = state;
    LoadingStore.setLoading(state === State.RUNNING);
  }

  @action.bound
  public resetState() {
    this.setState(State.IDLE);
  }

  @action.bound
  public setMode(mode: Mode) {
    this.mode = mode;
  }

  @action.bound
  public resetMode() {
    this.mode = Mode.NONE;
  }

  protected tryShowToast(message?: string) {
    try {
      ToastStore.showToast(message);
    } catch (e) {
      console.error("Toast", e);
    }
  }

  protected get apiBaseUrl() {
    let baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    if (!baseUrl.endsWith("/")) {
      baseUrl = `${baseUrl}/`;
    }
    return baseUrl;
  }

  protected apiUrl(...path: string[]) {
    console.log("path:", path);
    return this.apiBaseUrl + path.map((param) => param.replace(/\/$/, "")).join("/");
  }

  protected get selectedTenantId() {
    return localStorage.overrideTenantId || localStorage.tenantId;
  }

  protected generateFetchHeader(withAuth = true, override?: any) {
    const baseHeader = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "If-Modified-Since": "Thu, 01 Jun 1970 00:00:00 GMT",
    };
    let result: any = { ...baseHeader };
    if (withAuth) {
      result = {
        ...result,
        Authorization: `Bearer ${localStorage.accessToken}`,
      };
    }
    if (override) {
      result = {
        ...result,
        ...override,
      };
    }

    return result;
  }

  protected get loading() {
    return LoadingStore.loading;
  }

  protected fetchable() {
    return !!localStorage.accessToken;
  }
}
