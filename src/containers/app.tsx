import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { useSnackbar } from "notistack";
import { Box, css, Typography } from "@mui/material";
import { useDidMount } from "@/utils/effects";
import AuthStore, { AuthStatus } from "../stores/auth";
import LoadingStore from "../stores/loading";
import DeviceStore from "../stores/device";
import ApplianceStore from "../stores/appliance";
import { Login } from "./login";
import { Status } from "./status";
import { Appliance } from "./appliance";

interface IProps {
  AuthStore?: AuthStore;
  DeviceStore?: DeviceStore;
  ApplianceStore?: ApplianceStore;
  LoadingStore?: typeof LoadingStore;
}

const styles = {
  sectionText: css({
    margin: "2rem",
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
        <Box>
          <Box css={styles.sectionText}>
            <Typography variant={"h4"}>ステータス</Typography>
          </Box>
          <Status />
        </Box>
        <Box>
          <Box css={styles.sectionText}>
            <Typography variant={"h4"}>コントロール</Typography>
          </Box>
          <Appliance />
        </Box>
        {props.AuthStore!.authStatus === AuthStatus.Unauthorized && <Login />}
      </>
    );
  }),
);
