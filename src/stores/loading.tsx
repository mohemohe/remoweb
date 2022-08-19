import { action, computed, makeObservable, observable } from "mobx";

class LoadingStore {
  @observable
  public _loading: boolean;

  @observable
  public _lock: boolean;

  @observable
  public _disabled: boolean;

  constructor() {
    makeObservable(this);

    this._loading = false;
    this._lock = false;
    this._disabled = false;
  }

  @action
  public setLoading(loading: boolean) {
    this._loading = loading;
  }

  @action
  public lockLoading() {
    this._lock = true;
  }

  @action
  public unlockLoading() {
    this._lock = false;
  }

  @action
  public enableLoading() {
    this._disabled = false;
  }

  @action
  public disableLoading() {
    this._disabled = true;
  }

  @computed
  public get loading() {
    if (this._disabled) {
      return false;
    }
    return this._lock || this._loading;
  }
}

export default new LoadingStore();
