import { action, makeObservable, observable } from "mobx";
import ky from "ky";
import Base, { State } from "@/stores/base";
import { Appliance } from "@/interfaces/nature";

export default class ApplianceStore extends Base {
  @observable
  public appliances: Appliance[];

  constructor() {
    super();
    makeObservable(this);

    this.appliances = [];
  }

  @action
  public async fetchAppliances() {
    if (!this.fetchable) {
      return;
    }

    this.setState(State.RUNNING);
    try {
      const res = await ky.get(this.apiUrl("1/appliances"), { headers: this.generateFetchHeader() });
      if (!res.ok) {
        throw new Error();
      }
      this.appliances = await res.json<Appliance[]>();
      return this.setState(State.DONE);
    } catch (e) {
      this.tryEnqueueSnackbar("アプライアンスの取得に失敗しました");

      return this.setState(State.ERROR);
    }
  }
}