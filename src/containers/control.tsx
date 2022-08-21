import React from "react";
import { inject, observer } from "mobx-react";
import { BottomNavigation, BottomNavigationAction, Box, css, Icon, Typography } from "@mui/material";
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

export const Control = inject(
  "AuthStore",
  "DeviceStore",
  "ApplianceStore",
  "LoadingStore",
)(
  observer((props: IProps) => {
    const reloadAll = async () => {
      props.LoadingStore!.lockLoading();
      try {
        await Promise.all([props.DeviceStore!.fetchDevices(), props.ApplianceStore!.fetchAppliances()]);
      } finally {
        props.LoadingStore!.unlockLoading();
      }
    };

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
      </>
    );
  }),
);
