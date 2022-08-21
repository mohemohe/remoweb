import React from "react";
import { inject, observer } from "mobx-react";
import { Box, css, Icon, List, ListItemButton, ListItemText, Typography } from "@mui/material";
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
  root: css({
    margin: "2rem",
  }),
};

export const Setting = inject(
  "AuthStore",
  "DeviceStore",
  "ApplianceStore",
  "LoadingStore",
)(
  observer((props: IProps) => {
    return (
      <>
        <Box css={styles.root}>
          <Typography variant={"caption"} color={"textSecondary"}>
            アカウント
          </Typography>
          <List>
            <ListItemButton onClick={() => props.AuthStore!.logout()}>
              <ListItemText primary="ログアウト" primaryTypographyProps={{ color: "primary" }} />
            </ListItemButton>
          </List>
        </Box>
      </>
    );
  }),
);
