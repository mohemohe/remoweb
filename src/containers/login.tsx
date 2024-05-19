import { css } from "@emotion/react";
import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import AuthStore from "../stores/auth";
import { Box, Button, Checkbox, FormControlLabel, Icon, Link, Paper, TextField, Typography } from "@mui/material";
import { PasswordInput } from "@/components/passwordInput";

interface IProps {
  AuthStore?: AuthStore;
}

const styles = {
  root: css({
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(20, 20, 33, 0.6)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
  }),
  paper: css({
    padding: "2rem",
    width: 600,
    maxWidth: "calc(100vw - 2rem)",
  }),
  logoTypeWrapper: css({
    display: "flex",
    justifyContent: "center",
  }),
};

export const Login = inject("AuthStore")(
  observer((props: IProps) => {
    const [accessToken, setAcessToken] = useState("");
    const [useLocalStorage, setUseLocalStorage] = useState(false);

    return (
      <div css={styles.root}>
        <Paper css={styles.paper}>
          <Box css={styles.logoTypeWrapper}>
            <Typography className="logo-type" variant={"h3"}>
              RemoWeb
            </Typography>
          </Box>
          <Box mb={4} display={"flex"} justifyContent={"center"}>
            <Typography variant={"subtitle1"}>
              Web client for Nature Remo
            </Typography>
          </Box>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              props.AuthStore!.login(accessToken, useLocalStorage);
            }}
          >
            <Box mb={1}>
              <PasswordInput
                name={"password"}
                type={"password"}
                label={"Access Token"}
                fullWidth
                value={accessToken}
                onChange={(e) => setAcessToken(e.target.value)}
              />
            </Box>
            <Box mb={1}>
              <FormControlLabel
                control={<Checkbox checked={useLocalStorage} onChange={(e) => setUseLocalStorage(e.target.checked)} />}
                label="ログイン状態を保持する"
              />
            </Box>
            <Box mb={4}>
              <Button variant={"contained"} type={"submit"} fullWidth disabled={!accessToken}>
                Authorize
              </Button>
            </Box>
          </form>

          <Box>
            <Link href={"https://home.nature.global/"} target={"_blank"}>
              アクセストークンの取得
              <Icon fontSize={"small"} style={{ lineHeight: 1.25 }}>
                open_in_new
              </Icon>
            </Link>
          </Box>
        </Paper>
      </div>
    );
  }),
);
