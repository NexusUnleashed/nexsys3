/* global globalThis */
import * as React from "react";
import {
  FormGroup,
  FormLabel,
  Typography,
  TextField,
  Alert,
  AlertTitle,
  Collapse,
} from "@mui/material";
import ConfigSwitch from "./ConfigSwitch";

const SystemSettings = ({ settings }) => {
  const [stateSettings, setStateSettings] = React.useState({ ...settings });
  const [open, setOpen] = React.useState(settings.sep);

  React.useEffect(() => {
    globalThis.nexSys.sys.settings = { ...stateSettings };
  }, [stateSettings]);

  React.useEffect(() => {
    if (stateSettings.sep) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [stateSettings]);

  const handleText = (e) => {
    setStateSettings({
      ...stateSettings,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Typography component={"div"}>
      {!stateSettings.sep && <Collapse in={open}>
        <Alert severity="error" sx={{ fontSize: "16px" }}>
          <AlertTitle sx={{ fontSize: "16px" }}>nexSys Error</AlertTitle>
          Enter <strong>Command Separator</strong> to get started.
        </Alert>
      </Collapse>}
      <FormLabel component="legend">Nexsys Config</FormLabel>
      <FormGroup>
        <ConfigSwitch
          label="Custom Prompt"
          option={"customPrompt"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Priority Set"
          option={"echoPrioritySet"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Aff Got"
          option={"echoAffGot"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Aff Lost"
          option={"echoAffLost"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Balance Got"
          option={"echoBalanceGot"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Balance Lost"
          option={"echoBalanceLost"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Def Got"
          option={"echoDefGot"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Def Lost"
          option={"echoDefLost"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Trackable Got"
          option={"echoTrackableGot"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <ConfigSwitch
          label="Echo Trackable Lost"
          option={"echoTrackableLost"}
          settings={stateSettings}
          setStateSettings={setStateSettings}
        />
        <TextField
          id="sep"
          onChange={handleText}
          value={stateSettings.sep}
          size="small"
          label="Command Separator"
          style={{ width: "10em", margin: "10px 0 0 0" }}
        />
      </FormGroup>
    </Typography>
  );
};

export default SystemSettings;
