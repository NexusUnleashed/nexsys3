import { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import DefenceTable from "./DefenceTable";

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

const DefencePriorities = ({
  defs,
  defPriosKeepup,
  defPriosStatic,
  setDefPrios,
  classList,
}) => {
  const [keepup, setKeepup] = useState({ ...defPriosKeepup });
  const [staticDefs, setStaticDefs] = useState({ ...defPriosStatic });
  const [skill, setSkill] = useState(getClass());
  const [defList, setDefList] = useState(
    Object.keys(defs).filter(
      (def) =>
        (skill === "all" ||
          typeof defs[def].skills === "undefined" ||
          defs[def].skills.length === 0 ||
          defs[def].skills.indexOf(skill) > -1) &&
        defs[def].isServerSide
    )
  );

  const handleChange = (e) => {
    setSkill(e.target.value);
    setDefList(
      Object.keys(defs).filter(
        (def) =>
          (e.target.value === "all" ||
            typeof defs[def].skills === "undefined" ||
            defs[def].skills.length === 0 ||
            defs[def].skills.indexOf(e.target.value) > -1) &&
          defs[def].isServerSide
      )
    );
  };

  useEffect(() => {
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
      <div style={{ display: "flex" }}>
        <DefenceTable
          defList={defList.slice(0, parseInt(defList.length / 2))}
          defs={defs}
          defPrios={defPrios}
          setKeepup={setKeepup}
          setStaticDefs={setStaticDefs}
        />
        <DefenceTable
          defList={defList.slice(parseInt(defList.length / 2))}
          defs={defs}
          defPrios={defPrios}
          setKeepup={setKeepup}
          setStaticDefs={setStaticDefs}
        />
      </div>
    </div>
  );
};

export default DefencePriorities;
