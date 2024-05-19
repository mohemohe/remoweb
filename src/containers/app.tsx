import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { useSnackbar } from "notistack";
import { BottomNavigation, BottomNavigationAction, Box, CircularProgress, css, Fab, Icon } from "@mui/material";
import { useDidMount } from "@/utils/effects";
import AuthStore, { AuthStatus } from "../stores/auth";
import LoadingStore from "../stores/loading";
import DeviceStore from "../stores/device";
import ApplianceStore from "../stores/appliance";
import { Login } from "./login";
import { Control } from "./control";
import { Setting } from "./setting";
import TimerStore from "@/stores/timer";

interface IProps {
  AuthStore?: AuthStore;
  DeviceStore?: DeviceStore;
  ApplianceStore?: ApplianceStore;
  LoadingStore?: typeof LoadingStore;
  TimerStore?: TimerStore;
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
  "TimerStore",
)(
  observer((props: IProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const [bottomTabIndex, setBottomTabIndex] = useState(0);

    useDidMount(async () => {
      (window as any).enqueueSnackbar = enqueueSnackbar;
      await props.AuthStore!.checkAuth();
    });

    useEffect(() => {
      if (props.AuthStore!.authStatus === AuthStatus.Authorized) {
        props.TimerStore!.reload();
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
        <Box position={"fixed"} bottom={16} right={16}>
          <Fab
            aria-label="save"
            onClick={async () => await props.TimerStore!.reload()}
          >
            <Icon>refresh</Icon>
          </Fab>
          <CircularProgress size={68} color="primary" variant="determinate" value={props.TimerStore!.value} sx={{ position: "absolute", top: -6, left: -6 }} />
        </Box>
        {props.AuthStore!.authStatus === AuthStatus.Unauthorized && <Login />}
      </>
    );
  }),
);
