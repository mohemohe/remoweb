import AuthStore from "./auth";
import LoadingStore from "./loading";

export const stores = {
  AuthStore: new AuthStore(),
  LoadingStore,
};
