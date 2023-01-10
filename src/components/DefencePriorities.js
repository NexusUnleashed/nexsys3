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

const getColor = (def) => {
  let res;
  if (
    def.balsUsed.indexOf("balance") > -1 ||
    def.balsUsed.indexOf("equilibrium") > -1
  ) {
    res = "tomato";
  } else {
    res = "dodgerblue";
  }

  return res;
};

const DefenceRow = ({ def, defs, defPrios, setKeepup, setStaticDefs }) => {
  const [checked, setChecked] = React.useState(defPrios.static[def] > 0);
  const [prio, setPrio] = React.useState(
    defPrios.keepup[def] || defPrios.static[def] || 0
  );

  const handleChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleText = (e) => {
    setPrio(parseInt(e.target.value));
  };

  React.useEffect(() => {
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
      <TableCell
        sx={{
          fontSize: "12px",
          color: getColor(defs[def]),
        }}
        align="left"
      >
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
          value={prio}
          onChange={handleText}
        />
      </TableCell>
    </TableRow>
  );
};

const getClass = () => {
  let res = "";
  if (typeof GMCP !== "undefined" && GMCP.Char?.Status?.class) {
    if (GMCP.Char.Status.class.indexOf("Dragon") > -1) {
      res = "Dragon";
    } else {
      res = GMCP.Char.Status.class;
    }
  }

  return res;
};

const DefencePriorities = ({ defs, defPrios, setDefPrios, classList }) => {
  const [keepup, setKeepup] = React.useState({ ...defPrios.keepup });
  const [staticDefs, setStaticDefs] = React.useState({ ...defPrios.static });
  const [skill, setSkill] = React.useState(getClass());
  const [defList, setDefList] = React.useState(Object.keys(defs));

  const handleChange = (e) => {
    setSkill(e.target.value);
  };

  React.useEffect(() => {
    setDefPrios((prev) => ({
      ...prev,
      keepup: { ...keepup },
      static: { ...staticDefs },
    }));
  }, [keepup, staticDefs]);

  return (
    <div style={{ width: "100%" }}>
      <FormControl fullWidth>
        <InputLabel id="select-label">Class</InputLabel>
        <Select
          labelId="select-label"
          id="simple-select"
          value={skill}
          label="Class"
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
                <Tooltip
                  arrow
                  placement="bottom-end"
                  title={
                    <div>
                      <div style={{ fontSize: "14px" }}>
                        Red: Skills that require a balance
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        Blue: Skills that are free to use
                      </div>
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
                Priority
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {defList
              .filter(
                (def) =>
                  skill === "all" ||
                  typeof defs[def].skills === "undefined" ||
                  defs[def].skills.length === 0 ||
                  defs[def].skills.indexOf(skill) > -1
              )
              .map((def, i) => (
                <DefenceRow
                  key={def}
                  def={def}
                  defs={defs}
                  defPrios={defPrios}
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
