import {
  FormControlLabel,
  Switch,
} from "@mui/material";

const ConfigSwitch = ({ label, settings, option, setStateSettings }) => {

  const handleChange = () => {
    setStateSettings((settings) => {
      settings[option] = !settings[option];
      return { ...settings };
    });
  };

  return (
      <FormControlLabel
          label={label}
          control={
            <Switch
              checked={settings[option]}
              onChange={handleChange}
            />
          }
        />
  );
};

export default ConfigSwitch;