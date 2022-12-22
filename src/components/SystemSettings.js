/* global globalThis */
import * as React from "react";
import {
  FormGroup,
  FormLabel,
  Typography,
  TextField,
  FormControlLabel,
} from "@mui/material";
import ConfigSwitch from "./ConfigSwitch";

const SystemSettings = ({ settings }) => {
  const [stateSettings, setStateSettings] = React.useState(settings);
  console.log("render");
  
  React.useEffect(() => {
    console.log("useEffect");
    globalThis.nexSys.sys.settings = { ...stateSettings };
  }, [stateSettings]);

  const handleText = (e) => {
    setStateSettings({
      ...stateSettings,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Typography component={"div"}>
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
