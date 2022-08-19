import "./style.scss";
import { setLogLevel, original } from "./utils/logger";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "mobx-react";
import { stores } from "@/stores";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { App } from "./app";

original.info("%c" + `RemoWeb`, "font-size: 32px; color: #90CAF9");
original.info("%c" + `hash: ${import.meta.env.VITE_GIT_HASH || "-"}`, "font-size: 22px; color: #F48FB1");

setLogLevel((import.meta.env.VITE_LOG_LEVEL as any) || "silly");

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.querySelector("#app")!).render(
  <>
    <Provider {...stores}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </>,
);
