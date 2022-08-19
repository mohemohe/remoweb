import { css } from "@emotion/react";
import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import ApplianceStore from "../stores/appliance";
import { Box, Button, Checkbox, FormControlLabel, Grid, Icon, Link, Paper, TextField, Typography } from "@mui/material";

interface IProps {
  ApplianceStore?: ApplianceStore;
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

export const Appliance = inject("ApplianceStore")(
  observer((props: IProps) => {
    return (
      <Grid container spacing={2} css={styles.root}>
        {props.ApplianceStore!.appliances.length === 0 && (
          <Grid item sm={4} md={3} lg={2} xl={1}>
            <Paper className={"appliance"} css={styles.empty}>
              <Typography color={"GrayText"}>アプライアンスがありません</Typography>
            </Paper>
          </Grid>
        )}
        {props.ApplianceStore!.appliances.map((appliance) => (
          <Grid key={appliance.id} item sm={4} md={3} lg={2} xl={1}>
            <Paper className={"appliance"} css={styles.paper}>
              <Typography>{appliance.nickname}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }),
);
