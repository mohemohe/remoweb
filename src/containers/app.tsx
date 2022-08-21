import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { useSnackbar } from "notistack";
import { BottomNavigation, BottomNavigationAction, Box, css, Icon } from "@mui/material";
import { useDidMount } from "@/utils/effects";
import AuthStore, { AuthStatus } from "../stores/auth";
import LoadingStore from "../stores/loading";
import DeviceStore from "../stores/device";
import ApplianceStore from "../stores/appliance";
import { Login } from "./login";
import { Control } from "./control";
import { Setting } from "./setting";

interface IProps {
  AuthStore?: AuthStore;
  DeviceStore?: DeviceStore;
  ApplianceStore?: ApplianceStore;
  LoadingStore?: typeof LoadingStore;
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  }),
  main: css({
    flex: 1,
    overflow: "auto",
  }),
};

export const App = inject(
  "AuthStore",
  "DeviceStore",
  "ApplianceStore",
  "LoadingStore",
)(
  observer((props: IProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const [bottomTabIndex, setBottomTabIndex] = useState(0);

    const reloadAll = async () => {
      props.LoadingStore!.lockLoading();
      try {
        await Promise.all([props.DeviceStore!.fetchDevices(), props.ApplianceStore!.fetchAppliances()]);
      } finally {
        props.LoadingStore!.unlockLoading();
      }
    };

    useDidMount(async () => {
      (window as any).enqueueSnackbar = enqueueSnackbar;
      await props.AuthStore!.checkAuth();
    });

    useEffect(() => {
      if (props.AuthStore!.authStatus === AuthStatus.Authorized) {
        reloadAll();
      }
    }, [props.AuthStore!.authStatus]);

    return (
      <>
        <Box css={styles.root}>
          <Box css={styles.main}>
            {bottomTabIndex === 0 && <Control />}
            {bottomTabIndex === 1 && <Setting />}
          </Box>
          <BottomNavigation
            showLabels
            value={bottomTabIndex}
            onChange={(event, newValue) => {
              setBottomTabIndex(newValue);
            }}
          >
            <BottomNavigationAction label="コントロール" icon={<Icon>wifi</Icon>} />
            <BottomNavigationAction label="設定" icon={<Icon>settings</Icon>} />
          </BottomNavigation>
        </Box>
        {props.AuthStore!.authStatus === AuthStatus.Unauthorized && <Login />}
      </>
    );
  }),
);
