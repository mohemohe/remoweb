import { action, makeObservable, observable, toJS } from "mobx";

export interface Toast {
  uid: string;
  message?: string;
  open: boolean;
}

class ToastStore {
  @observable
  public toasts: Toast[];

  constructor() {
    makeObservable(this);

    this.toasts = [];
  }

  @action
  public showToast(message?: string) {
    const uid = `${new Date().getTime() + Math.random()}`;
    const nextToasts = this.toasts.slice(-9);
    nextToasts.push({ message, open: true, uid });
    console.log("toasts:", toJS(nextToasts));
    this.toasts = [...nextToasts];

    setTimeout(() => this.closeToast(uid), 5000);
  }

  @action
  public setToast(toasts: Toast[]) {
    this.toasts = [...toasts];
  }

  @action
  public closeToast(uid: string) {
    const targetIndex = this.toasts.findIndex((value) => value.uid === uid);
    if (targetIndex !== -1) {
      this.toasts[targetIndex].open = false;
    }
    this.setToast(this.toasts);
  }
}

const store = new ToastStore();
export default store;
