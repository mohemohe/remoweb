import ApplianceStore from "@/stores/appliance";
import DeviceStore from "@/stores/device";
import loading from "@/stores/loading";
import { action, computed, makeObservable, observable } from "mobx";

export default class TimerStore {
  private _applianceStore: ApplianceStore;
  private _deviceStore: DeviceStore;

  @observable
  public interval: number = 120; // TODO: make configurable

  @observable
  public current: number = 0;

  @observable
  public intervalHandler: number;

  constructor(applianceStore: ApplianceStore, deviceStore: DeviceStore) {
    makeObservable(this);

    this._applianceStore = applianceStore;
    this._deviceStore = deviceStore;
    this.intervalHandler = setInterval(() => this.onInterval(), 1000);
  }

  @action
  public async reload() {
    try {
      loading.lockLoading();

      await Promise.all([this._applianceStore.fetchAppliances(), this._deviceStore.fetchDevices()]);
    } finally {
      loading.unlockLoading();
    }
  }

  @action
  private onInterval() {
    this.current++;
    if (this.current >= this.interval) {
      this.current = 0;
      this.reload();
    }
  }

  @computed
  public get value() {
    return this.current / this.interval * 100;
  }
}
