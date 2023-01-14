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
  Tooltip,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import DefenceRow from "./DefenceRow";

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
                      Checked defences will not be kept up by serverside curing.
                      Checked defences will be managed by nexSys using the
                      "defup" alias.
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
                  (skill === "all" ||
                    typeof defs[def].skills === "undefined" ||
                    defs[def].skills.length === 0 ||
                    defs[def].skills.indexOf(skill) > -1) &&
                  defs[def].isServerSide
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
