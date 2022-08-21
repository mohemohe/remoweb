import React, { ChangeEvent } from "react";
import { IconButton, InputAdornment, TextField, Icon } from "@mui/material";

export interface IProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

export const PasswordInput: React.FC<IProps> = (props) => {
  const [inputTypeState, setInputTypeState] = React.useState("password");

  return (
    <TextField
      label={props.label}
      value={props.value}
      fullWidth
      type={inputTypeState}
      onChange={(e) => props.onChange(e)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={() => setInputTypeState(inputTypeState === "password" ? "text" : "password")}>
              {inputTypeState === "password" ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
