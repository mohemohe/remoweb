import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { Box } from "@mui/material";
import AuthStore from "./stores/auth";

interface IProps {
  AuthStore?: AuthStore;
}

export const App = inject("AuthStore")(
  observer((props: IProps) => {
    return (
      <>
        <Box>It works!</Box>
      </>
    );
  }),
);
