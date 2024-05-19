import AuthStore from "./auth";
import LoadingStore from "./loading";
import DeviceStore from "./device";
import ApplianceStore from "./appliance";
import TimerStore from "./timer";

const authStore = new AuthStore();
const deviceStore = new DeviceStore();
const applianceStore = new ApplianceStore();
const timerStore = new TimerStore(applianceStore, deviceStore);

export const stores = {
  AuthStore: authStore,
  DeviceStore: deviceStore,
  ApplianceStore: applianceStore,
  LoadingStore,
  TimerStore: timerStore,
};
