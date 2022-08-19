import AuthStore from "./auth";
import LoadingStore from "./loading";
import DeviceStore from "./device";
import ApplianceStore from "./appliance";

export const stores = {
  AuthStore: new AuthStore(),
  DeviceStore: new DeviceStore(),
  ApplianceStore: new ApplianceStore(),
  LoadingStore,
};
