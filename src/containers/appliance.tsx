import { css } from "@emotion/react";
import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import ApplianceStore from "../stores/appliance";
import {
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardActionArea,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Icon,
  Divider,
  Tab,
  Tabs,
} from "@mui/material";

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
  dialogTitle: css({
    display: "flex",
    justifyContent: "space-between",
  }),
};

export const Appliance = inject("ApplianceStore")(
  observer((props: IProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [applianceIndex, setApplianceIndex] = useState(-1);

    const openDialog = (index: number) => {
      setApplianceIndex(index);
      setIsOpenDialog(true);
    };
    const closeDialog = () => {
      setIsOpenDialog(false);
      setApplianceIndex(-1);
    };

    return (
      <>
        <Grid container spacing={2} css={styles.root}>
          {props.ApplianceStore!.appliances.length === 0 && (
            <Grid item sm={4} md={3} lg={2} xl={1}>
              <Paper className={"appliance"} css={styles.empty}>
                <Typography color={"GrayText"}>アプライアンスがありません</Typography>
              </Paper>
            </Grid>
          )}
          {props.ApplianceStore!.appliances.map((appliance, index) => (
            <Grid key={appliance.id} item sm={4} md={3} lg={2} xl={1}>
              <Card className={"appliance"}>
                <CardActionArea onClick={() => openDialog(index)}>
                  <Box css={styles.paper}>
                    <Typography>{appliance.nickname}</Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Dialog fullScreen={fullScreen} fullWidth open={isOpenDialog}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            <Box css={styles.dialogTitle}>
              {props.ApplianceStore!.appliances[applianceIndex]?.nickname || "-"}
              <IconButton
                aria-label="close"
                onClick={() => closeDialog()}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Icon>close</Icon>
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {props.ApplianceStore!.appliances[applianceIndex]?.aircon && <Aircon applianceIndex={applianceIndex} />}
            {props.ApplianceStore!.appliances[applianceIndex]?.light &&
              props.ApplianceStore!.appliances[applianceIndex]?.light.buttons.map((button) => (
                <Button key={button.name} onClick={() => props.ApplianceStore!.sendLight(props.ApplianceStore!.appliances[applianceIndex]?.id, button.name)}>
                  {button.label}
                </Button>
              ))}
            {props.ApplianceStore!.appliances[applianceIndex]?.tv &&
              props.ApplianceStore!.appliances[applianceIndex]?.tv.buttons.map((button) => (
                <Button key={button.name} onClick={() => props.ApplianceStore!.sendTv(props.ApplianceStore!.appliances[applianceIndex]?.id, button.name)}>
                  {button.label}
                </Button>
              ))}
            {props.ApplianceStore!.appliances[applianceIndex]?.signals &&
              props.ApplianceStore!.appliances[applianceIndex]?.signals.map((signal) => (
                <Button key={signal.id} onClick={() => props.ApplianceStore!.sendSignal(signal.id)}>
                  {signal.name}
                </Button>
              ))}
          </DialogContent>
        </Dialog>
      </>
    );
  }),
);

const Aircon = inject("ApplianceStore")(
  observer((props: IProps & { applianceIndex: number }) => {
    const { id, aircon, settings } = props.ApplianceStore!.appliances[props.applianceIndex];

    const [mode, setMode] = useState(settings.mode);

    return (
      <>
        {aircon?.range.fixedButtons && (
          <>
            {aircon.range.fixedButtons?.map((button, index) => (
              <Button key={index} onClick={() => props.ApplianceStore!.sendAircon(id, { button })}>
                {button}
              </Button>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}
        {aircon?.range.modes && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={mode} onChange={(e, value) => setMode(value)}>
                {Object.keys(aircon?.range.modes).map((modeKey) => (
                  <Tab label={modeKey} value={modeKey} />
                ))}
              </Tabs>
            </Box>
            {
              <>
                {(aircon?.range.modes as any)[mode].temp.map((temp: any) => (
                  <Button key={temp} onClick={() => "TODO"}>
                    {temp}
                  </Button>
                ))}
              </>
            }
          </>
        )}
      </>
    );
  }),
);
