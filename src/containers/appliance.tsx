import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
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
  DialogContent,
  DialogTitle,
  IconButton,
  Icon,
  Divider,
  Tab,
  Tabs,
  Slider,
} from "@mui/material";
import { t } from "@/ja";

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
  slider: css({
    display: "flex",
    alignItems: "center",

    "& .label": {
      display: "flex",
      justifyContent: "flex-end",
      paddingLeft: "1rem",
      width: "8em",
    },
  }),
  actionButton: css({
    display: "flex",
    justifyContent: "flex-end",
  }),
};

export const Appliance = inject("ApplianceStore")(
  observer((props: IProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [applianceIndex, setApplianceIndex] = useState(-1);
    const [sent, setSent] = useState(false);

    const openDialog = (index: number) => {
      setSent(false);
      setApplianceIndex(index);
      setIsOpenDialog(true);
    };
    const closeDialog = () => {
      setIsOpenDialog(false);
      setApplianceIndex(-1);

      if (sent) {
        props.ApplianceStore!.fetchAppliances();
      }
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
                    <Box>
                      <Typography>{appliance.nickname}</Typography>
                    </Box>
                    {appliance.settings && (
                      <Box mt={2}>
                        <Typography variant={"body2"} color={"textSecondary"}>
                          {t(appliance.settings.mode)}
                        </Typography>
                        <Typography variant={"body2"} color={"textSecondary"}>
                          温度: {t(appliance.settings.temp)} {appliance.aircon.tempUnit === "c" ? "℃" : "℉"}
                        </Typography>
                        <Typography variant={"body2"} color={"textSecondary"}>
                          風向: {t(appliance.settings.dir)}
                        </Typography>
                        <Typography variant={"body2"} color={"textSecondary"}>
                          風量: {t(appliance.settings.vol)}
                        </Typography>
                      </Box>
                    )}
                    {appliance.light?.state && (
                      <Box mt={2}>
                        <Typography variant={"body2"} color={"textSecondary"}>
                          {appliance.light.state.power?.toUpperCase()}
                        </Typography>
                      </Box>
                    )}
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
            {props.ApplianceStore!.appliances[applianceIndex]?.aircon && <Aircon applianceIndex={applianceIndex} send={() => setSent(true)} />}
            {props.ApplianceStore!.appliances[applianceIndex]?.light &&
              props.ApplianceStore!.appliances[applianceIndex]?.light.buttons.map((button) => (
                <Button
                  key={button.name}
                  onClick={() => props.ApplianceStore!.sendLight(props.ApplianceStore!.appliances[applianceIndex]?.id, button.name).then(() => setSent(true))}
                >
                  {button.label}
                </Button>
              ))}
            {props.ApplianceStore!.appliances[applianceIndex]?.tv &&
              props.ApplianceStore!.appliances[applianceIndex]?.tv.buttons.map((button) => (
                <Button
                  key={button.name}
                  onClick={() => props.ApplianceStore!.sendTv(props.ApplianceStore!.appliances[applianceIndex]?.id, button.name).then(() => setSent(true))}
                >
                  {button.label}
                </Button>
              ))}
            {props.ApplianceStore!.appliances[applianceIndex]?.signals &&
              props.ApplianceStore!.appliances[applianceIndex]?.signals.map((signal) => (
                <Button key={signal.id} onClick={() => props.ApplianceStore!.sendSignal(signal.id).then(() => setSent(true))}>
                  {signal.name}
                </Button>
              ))}
          </DialogContent>
        </Dialog>
      </>
    );
  }),
);

const fallbackIndex = (arr: string[]) => {
  const autoIndex = arr.findIndex((a) => a === "auto");
  if (autoIndex !== -1) {
    return autoIndex;
  }
  const swingIndex = arr.findIndex((a) => a === "swing");
  if (swingIndex !== -1) {
    return swingIndex;
  }
  return Math.floor((arr.length - 1) / 2);
};

const Aircon = inject("ApplianceStore")(
  observer((props: IProps & { applianceIndex: number; send: () => void }) => {
    const { id, aircon, settings } = props.ApplianceStore!.appliances[props.applianceIndex];

    const [operation_mode, setOperationMode] = useState(settings.mode);
    const [temperature, setTemperature] = useState(settings.temp);
    const [air_direction, setAirDirection] = useState(settings.dir);
    const [air_volume, setAirVolume] = useState(settings.vol);

    const { temp: rawTemp, dir: rawDir, vol: rawVol } = aircon?.range.modes[operation_mode as "auto"];
    const temp = rawTemp.filter((t) => t !== "");
    const dir = rawDir.filter((d) => d !== "");
    const vol = rawVol.filter((v) => v !== "");

    useEffect(() => {
      if (operation_mode === settings.mode) {
        setTemperature(settings.temp);
        setAirDirection(settings.dir);
        setAirVolume(settings.vol);
      } else {
        setTemperature(temp[fallbackIndex(temp)]);
        setAirDirection(dir[fallbackIndex(dir)]);
        setAirVolume(vol[fallbackIndex(vol)]);
      }
    }, [operation_mode]);

    return (
      <>
        {aircon?.range.fixedButtons && (
          <>
            {aircon.range.fixedButtons?.map((button, index) => (
              <Button key={index} onClick={() => props.ApplianceStore!.sendAircon(id, { button }).then(() => props.send())}>
                {button}
              </Button>
            ))}
            <Divider sx={{ mt: 2 }} />
          </>
        )}
        {aircon?.range.modes && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={operation_mode} onChange={(e, value) => setOperationMode(value)}>
                {Object.keys(aircon?.range.modes).map((modeKey) => (
                  <Tab key={modeKey} label={t(modeKey)} value={modeKey} />
                ))}
              </Tabs>
            </Box>
            {
              <>
                <Box my={2}>
                  <Typography>{"温度"}</Typography>
                  <Box css={styles.slider} mb={2}>
                    <Slider
                      className={"slider"}
                      disabled={temp.length === 0}
                      value={temp.findIndex((t) => t === temperature)}
                      min={0}
                      max={temp.length - 1}
                      marks={true}
                      valueLabelFormat={(value) => temp[value as number] + " ℃"}
                      valueLabelDisplay={"auto"}
                      onChange={(e, value) => setTemperature(temp[value as number])}
                    />
                    <Box className={"label"}>
                      <Typography>{(temperature || "-") + " ℃"}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box my={2}>
                  <Typography>{"風向"}</Typography>
                  <Box css={styles.slider} mb={2}>
                    <Slider
                      className={"slider"}
                      disabled={dir.length === 0}
                      value={dir.findIndex((t) => t === air_direction)}
                      min={0}
                      max={dir.length - 1}
                      marks={true}
                      valueLabelFormat={(value) => t(dir[value as number])}
                      valueLabelDisplay={"auto"}
                      onChange={(e, value) => setAirDirection(dir[value as number])}
                    />
                    <Box className={"label"}>
                      <Typography>{t(air_direction)}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box my={2}>
                  <Typography>{"風量"}</Typography>
                  <Box css={styles.slider} mb={2}>
                    <Slider
                      className={"slider"}
                      disabled={vol.length === 0}
                      value={vol.findIndex((t) => t === air_volume)}
                      min={0}
                      max={vol.length - 1}
                      marks={true}
                      valueLabelFormat={(value) => t(vol[value as number])}
                      valueLabelDisplay={"auto"}
                      onChange={(e, value) => setAirVolume(vol[value as number])}
                    />
                    <Box className={"label"}>
                      <Typography>{t(air_volume)}</Typography>
                    </Box>
                  </Box>
                </Box>
              </>
            }
            <Box css={styles.actionButton} pt={1}>
              <Button onClick={() => props.ApplianceStore!.sendAircon(id, { operation_mode, temperature, air_direction, air_volume }).then(() => props.send())}>
                適用
              </Button>
            </Box>
          </>
        )}
      </>
    );
  }),
);
