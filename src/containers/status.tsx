import { css } from "@emotion/react";
import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import DeviceStore from "../stores/device";
import { Box, Button, Checkbox, FormControlLabel, Grid, Icon, Link, Paper, TextField, Typography } from "@mui/material";

interface IProps {
  DeviceStore?: DeviceStore;
}

const styles = {
  root: css({
    display: "flex",
    padding: "0 2rem",
  }),
  paper: css({
    padding: "2rem",
    minHeight: 202,
  }),
  empty: css({
    padding: "2rem",
    minHeight: 202,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  }),
  hol: css({
    display: "flex",
    alignItems: "baseline",
  }),
  unit: css({
    marginLeft: "0.5em",
  }),
};

export const Status = inject("DeviceStore")(
  observer((props: IProps) => {
    return (
      <Grid container spacing={2} css={styles.root}>
        {props.DeviceStore!.devices.length === 0 && (
          <Grid item sm={6} md={4} lg={3} xl={2}>
            <Paper className={"device"} css={styles.empty}>
              <Typography color={"GrayText"}>デバイスがありません</Typography>
            </Paper>
          </Grid>
        )}
        {props.DeviceStore!.devices.map((device) => (
          <Grid key={device.id} item sm={6} md={4} lg={3} xl={2}>
            <Paper className={"device"} css={styles.paper}>
              <Typography>{device.name}</Typography>
              <Box css={styles.hol} mt={1}>
                <Typography variant={"h3"}>{device.newest_events.te?.val || "-"}</Typography>
                <Typography variant={"h5"} css={styles.unit}>
                  ℃
                </Typography>
              </Box>
              <Grid container spacing={2} mt={0}>
                <Grid item sm={6}>
                  <Box css={styles.hol}>
                    <Typography variant={"h5"}>{device.newest_events.hu?.val || "-"}</Typography>
                    <Typography css={styles.unit}>%</Typography>
                  </Box>
                </Grid>
                <Grid item sm={6}>
                  <Box css={styles.hol}>
                    <Typography variant={"h5"}>{device.newest_events.il?.val || "-"}</Typography>
                    <Typography css={styles.unit}>lx</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }),
);
