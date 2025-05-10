/* global globalThis */
import * as React from "react";
import {
  FormGroup,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Alert,
  AlertTitle,
  Collapse,
  Slider,
} from "@mui/material";
import ConfigSwitch from "./ConfigSwitch";

const SystemSettings = ({ settings, setSettings }) => {
  const [stateSettings, setStateSettings] = React.useState(settings);
  const [open, setOpen] = React.useState(settings.sep);

  React.useEffect(() => {
    setSettings({ ...stateSettings });
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
  const handleTextNumbers = (e) => {
    setStateSettings({
      ...stateSettings,
      [e.target.id]: parseInt(e.target.value) || e.target.value,
    });
  };

  const handleSelection = (e) => {
    setStateSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheck = (e) => {
    setStateSettings((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
  };

  return (
    <div>
      {!stateSettings.sep && (
        <Collapse in={open}>
          <Alert severity="error" sx={{ fontSize: "12px" }}>
            <AlertTitle sx={{ fontSize: "14px" }}>nexSys Error</AlertTitle>
            Enter <strong>Command Separator</strong> to get started.
          </Alert>
        </Collapse>
      )}
      <div style={{ display: "flex", gap: "50px" }}>
        <div>
          <div>
            <FormLabel component="legend" sx={{ margin: 1 }}>
              Nexsys Config
            </FormLabel>
            <FormGroup>
              <ConfigSwitch
                label="Load on login"
                option={"loadOnLogin"}
                handleCheck={handleCheck}
                checked={stateSettings.loadOnLogin}
              />
              <ConfigSwitch
                label="Override Tab target"
                option={"overrideTab"}
                handleCheck={handleCheck}
                checked={stateSettings.overrideTab}
              />
              <ConfigSwitch
                label="Queue while paused"
                option={"queueWhilePaused"}
                handleCheck={handleCheck}
                checked={stateSettings.queueWhilePaused}
              />
              <ConfigSwitch
                label="Custom Prompt"
                option={"customPrompt"}
                handleCheck={handleCheck}
                checked={stateSettings["customPrompt"]}
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
          </div>
          <div style={{ marginTop: "20px" }}>
            <FormLabel component="legend" sx={{ margin: 1 }}>
              Notices Config
            </FormLabel>
            <FormGroup>
            <ConfigSwitch
                label="Echo Output"
                option={"echoOutput"}
                handleCheck={handleCheck}
                checked={stateSettings["echoOutput"]}
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
            </FormGroup>
          </div>
        </div>
        <div>
          <FormLabel component="legend" sx={{ margin: 1 }}>
            Curing Config
          </FormLabel>
          <FormGroup>
            <ToggleButtonGroup
              color="primary"
              value={stateSettings.curingMethod}
              exclusive
              size="small"
              onChange={handleSelection}
              aria-label="Curing Type"
            >
              <ToggleButton
                value="Transmutation"
                name="curingMethod"
                sx={{ width: 95, height: 25 }}
              >
                Transmutation
              </ToggleButton>
              <ToggleButton
                value="Concoctions"
                name="curingMethod"
                sx={{ width: 95, height: 25 }}
              >
                Concoctions
              </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              color="primary"
              value={stateSettings["sipPriority"]}
              exclusive
              size="small"
              onChange={handleSelection}
              aria-label="Sip Type"
            >
              <ToggleButton
                value="Health"
                name="sipPriority"
                sx={{ width: 95, height: 25 }}
              >
                Health
              </ToggleButton>
              <ToggleButton
                value="Mana"
                name="sipPriority"
                sx={{ width: 95, height: 25 }}
              >
                Mana
              </ToggleButton>
            </ToggleButtonGroup>
            <ConfigSwitch
              label="Batching"
              option={"batch"}
              handleCheck={handleCheck}
              checked={stateSettings["batch"]}
            />
            <ConfigSwitch
              label="Tree Tatoo"
              option={"tree"}
              handleCheck={handleCheck}
              checked={stateSettings["tree"]}
            />
            <ConfigSwitch
              label="Focus"
              option={"focus"}
              handleCheck={handleCheck}
              checked={stateSettings["focus"]}
            />
            <ConfigSwitch
              label="Focus over Herbs"
              option={"focusOverHerbs"}
              handleCheck={handleCheck}
              checked={stateSettings["focusOverHerbs"]}
            />
            <div style={{ display: "flex" }}>
              <ConfigSwitch
                label="Clotting at"
                option={"clot"}
                handleCheck={handleCheck}
                checked={stateSettings["clot"]}
              />
              <TextField
                id="clotAt"
                error={
                  stateSettings.clotAt < 0 ||
                  !Number.isInteger(parseInt(stateSettings.clotAt))
                    ? true
                    : false
                }
                label={
                  stateSettings.clotAt < 0 ||
                  !Number.isInteger(parseInt(stateSettings.clotAt))
                    ? "###"
                    : ""
                }
                onChange={handleTextNumbers}
                value={stateSettings.clotAt}
                size="small"
                style={{ width: "5em" }}
              />
            </div>
            <ConfigSwitch
              label="Insomnia"
              option={"insomnia"}
              handleCheck={handleCheck}
              checked={stateSettings["insomnia"]}
            />
          </FormGroup>
        </div>
        <div style={{ width: 175 }}>
          <FormLabel component="legend" sx={{ margin: 1 }}>
            Curing Config Cont.
          </FormLabel>
          <FormGroup>
            <FormLabel component="legend">
              Sip health at ({stateSettings["sipHealthAt"]}%)
            </FormLabel>
            <Slider
              aria-label="Always visible"
              name="sipHealthAt"
              value={stateSettings["sipHealthAt"]}
              onChange={handleSelection}
              step={5}
              size="small"
              marks={false}
              valueLabelDisplay="auto"
            />
            <FormLabel component="legend">
              Sip mana at ({stateSettings["sipManaAt"]}%)
            </FormLabel>
            <Slider
              aria-label="Always visible"
              name="sipManaAt"
              size="small"
              value={stateSettings["sipManaAt"]}
              onChange={handleSelection}
              step={5}
              marks={false}
              valueLabelDisplay="auto"
            />
            <FormLabel component="legend">
              Moss health at ({stateSettings["mossHealthAt"]}%)
            </FormLabel>
            <Slider
              aria-label="Always visible"
              name="mossHealthAt"
              size="small"
              value={stateSettings["mossHealthAt"]}
              onChange={handleSelection}
              step={5}
              marks={false}
              valueLabelDisplay="auto"
            />
            <FormLabel component="legend">
              Moss mana at ({stateSettings["mossManaAt"]}%)
            </FormLabel>
            <Slider
              aria-label="Always visible"
              name="mossManaAt"
              size="small"
              value={stateSettings["mossManaAt"]}
              onChange={handleSelection}
              step={5}
              marks={false}
              valueLabelDisplay="auto"
            />
            <FormLabel component="legend">
              Fractures above ({stateSettings["fracturesAbove"]}%)
            </FormLabel>
            <Slider
              aria-label="Always visible"
              name="fracturesAbove"
              size="small"
              value={stateSettings["fracturesAbove"]}
              onChange={handleSelection}
              step={5}
              marks={false}
              valueLabelDisplay="auto"
            />
            <FormLabel component="legend">
              Clot above ({stateSettings["clotAbove"]}%) Health
            </FormLabel>
            <Slider
              aria-label="Always visible"
              name="clotAbove"
              size="small"
              value={stateSettings["clotAbove"]}
              onChange={handleSelection}
              step={5}
              marks={false}
              valueLabelDisplay="auto"
            />
            <FormLabel component="legend">
              Mana abilities above ({stateSettings["manaAbilitiesAbove"]}%)
            </FormLabel>
            <Slider
              aria-label="Always visible"
              name="manaAbilitiesAbove"
              size="small"
              value={stateSettings["manaAbilitiesAbove"]}
              onChange={handleSelection}
              step={5}
              marks={false}
              valueLabelDisplay="auto"
            />
          </FormGroup>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
