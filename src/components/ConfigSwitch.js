import {
  FormControlLabel,
  Switch,
} from "@mui/material";

const ConfigSwitch = ({ label, settings, option, setStateSettings }) => {

  const handleChange = (e) => {
    setStateSettings((settings) => {
      settings[option] = e.target.checked;
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