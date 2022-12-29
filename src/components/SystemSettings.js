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

const SystemSettings = ({ settings, setSettings }) => {
  const [stateSettings, setStateSettings] = React.useState(settings);
  const [open, setOpen] = React.useState(settings.sep);

  React.useEffect(() => {
    console.log('render');
    setSettings({ ...stateSettings });
    //console.log(globalThis.nexSys.sys.settings);
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

  const handleCheck = (e) => {
    /*
    setStateSettings((prev) => {
      prev[e.target.id] = e.target.checked;
      return { ...prev };
    });
    */
    /*
    const temp = { ...stateSettings };
    temp[e.target.id] = e.target.checked;
    setStateSettings({ ...temp });
    */
    setStateSettings((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
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
          handleCheck={handleCheck}
          checked={stateSettings["customPrompt"]}
        />
        <ConfigSwitch
          label="Echo Priority Set"
          option={"echoPrioritySet"}
          handleCheck={handleCheck}
          checked={stateSettings["echoPrioritySet"]}
        />
        <ConfigSwitch
          label="Echo Aff Got"
          option={"echoAffGot"}
          handleCheck={handleCheck}
          checked={stateSettings["echoAffGot"]}
        />
        <ConfigSwitch
          label="Echo Aff Lost"
          option={"echoAffLost"}
          handleCheck={handleCheck}
          checked={stateSettings["echoAffLost"]}
        />
        <ConfigSwitch
          label="Echo Balance Got"
          option={"echoBalanceGot"}
          handleCheck={handleCheck}
          checked={stateSettings["echoBalanceGot"]}
        />
        <ConfigSwitch
          label="Echo Balance Lost"
          option={"echoBalanceLost"}
          handleCheck={handleCheck}
          checked={stateSettings["echoBalanceLost"]}
        />
        <ConfigSwitch
          label="Echo Def Got"
          option={"echoDefGot"}
          handleCheck={handleCheck}
          checked={stateSettings["echoDefGot"]}
        />
        <ConfigSwitch
          label="Echo Def Lost"
          option={"echoDefLost"}
          handleCheck={handleCheck}
          checked={stateSettings["echoDefLost"]}
        />
        <ConfigSwitch
          label="Echo Trackable Got"
          option={"echoTrackableGot"}
          handleCheck={handleCheck}
          checked={stateSettings["echoTrackableGot"]}
        />
        <ConfigSwitch
          label="Echo Trackable Lost"
          option={"echoTrackableLost"}
          handleCheck={handleCheck}
          checked={stateSettings["echoTrackableLost"]}
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
