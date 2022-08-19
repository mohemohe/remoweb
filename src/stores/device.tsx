import { action, makeObservable, observable } from "mobx";
import ky from "ky";
import Base, { State } from "@/stores/base";
import { Device } from "@/interfaces/nature";

export default class DeviceStore extends Base {
  @observable
  public devices: Device[];

  constructor() {
    super();
    makeObservable(this);

    this.devices = [];
  }

  @action
  public async fetchDevices() {
    if (!this.fetchable) {
      return;
    }

    this.setState(State.RUNNING);
    try {
      let url;
      if (this.accessToken === "mock") {
        url = this.mockUrl("1/devices");
      } else {
        url = this.apiUrl("1/devices");
      }
      const res = await ky.get(url, { headers: this.generateFetchHeader() });
      if (!res.ok) {
        throw new Error();
      }
      this.devices = await res.json<Device[]>();
      return this.setState(State.DONE);
    } catch (e) {
      this.tryEnqueueSnackbar("デバイスの取得に失敗しました");

      return this.setState(State.ERROR);
    }
  }
}
