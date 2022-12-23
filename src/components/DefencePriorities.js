import * as React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Checkbox,
  Tooltip,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";

const DefenceRow = ({ def, defs, setKeepup, setStaticDefs }) => {
  const [checked, setChecked] = React.useState(false);
  const [prio, setPrio] = React.useState(defs[def].prio);

  const handleChange = (e) => {
    console.log("handleChange");
    setChecked(e.target.checked);
  };

  const handleText = (e) => {
    console.log("handleText");
    setPrio(parseInt(e.target.value));
  };

  React.useEffect(() => {
    console.log('defencerow useeffect');
    console.log(`${def} ${prio}`);
    setStaticDefs((prevState) => {
      return { ...prevState, ...{ [def]: checked ? prio : 0 } };
    });
    setKeepup((prevState) => {
      return { ...prevState, ...{ [def]: checked ? 0 : prio } };
    });
  }, [prio, checked]);

  return (
    <TableRow
      key={def}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>
        <Checkbox onChange={handleChange} checked={checked} />
      </TableCell>
      <TableCell sx={{ fontSize: "12px" }} align="left">
        {defs[def].name}
      </TableCell>
      <TableCell align="left">
        <TextField
          error={prio < 0 || !Number.isInteger(parseInt(prio)) ? true : false}
          label={prio < 0 || !Number.isInteger(parseInt(prio)) ? "error" : ""}
          margin="none"
          size="small"
          sx={{ width: "8ch" }}
          variant="outlined"
          defaultValue={prio}
          onChange={handleText}
        />
      </TableCell>
    </TableRow>
  );
};

const DefencePriorities = ({ defences, prios, classList }) => {
  const [defs, setDefs] = React.useState({ ...defences });
  const [keepup, setKeepup] = React.useState({ ...prios.keepup });
  const [staticDefs, setStaticDefs] = React.useState({ ...prios.static });
  const [skill, setSkill] = React.useState(typeof GMCP === 'undefined' ? "" : GMCP.Char.Status.class);
  const defList = Object.keys(defs);

  const handleChange = (e) => {
    setSkill(e.target.value);
  };

  React.useEffect(() => {
    console.log("useEffect");
    globalThis.nexSys.defPrios.keepup = { ...keepup };
    globalThis.nexSys.defPrios.static = { ...staticDefs };
  }, [keepup, staticDefs]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Class</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={skill}
          label="This is a test"
          onChange={handleChange}
        >
          <MenuItem value={"all"}>{"All"}</MenuItem>
          {classList.map((skill, i) => (
            <MenuItem value={skill} key={i}>
              {skill}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table stickyHeader size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", fontSize: "12px" }}>
                Defup
                <Tooltip
                  arrow
                  placement="bottom-end"
                  title={
                    <div style={{ fontSize: "14px" }}>
                      Defenses not kept up automatically, only put up during
                      defup.
                    </div>
                  }
                >
                  <HelpOutline fontSize="small" />
                </Tooltip>
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold", fontSize: "12px" }}
                align="left"
              >
                Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "12px" }}
                align="left"
              >
                Priority
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {defList
              .filter(
                (def) =>
                  skill === "All" ||
                  defs[def].skills.length === 0 ||
                  defs[def].skills.indexOf(skill) > -1
              )
              .map((def, i) => (
                <DefenceRow
                  key={i}
                  def={def}
                  defs={defs}
                  setKeepup={setKeepup}
                  setStaticDefs={setStaticDefs}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DefencePriorities;
