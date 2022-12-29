import {
  FormControlLabel,
  Switch,
} from "@mui/material";

const ConfigSwitch = ({ label, option, handleCheck, checked }) => {

  const handleChange = (e) => {
    handleCheck(e);
  };

  return (
    <FormControlLabel
      label={label}
      control={
        <Switch
          id={option}
          checked={checked}
          onChange={handleChange}
        />
      }
    />
  );
};

export default ConfigSwitch;