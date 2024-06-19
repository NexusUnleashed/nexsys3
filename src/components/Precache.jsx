/* global nexSys */

import * as React from "react";
import { Typography } from "@mui/material";
import GroupedButtons from "./GroupedButtons";

const herbList = [
  "ash",
  "bayberry",
  "bellwort",
  "bloodroot",
  "cohosh",
  "elm",
  "ginger",
  "ginseng",
  "goldenseal",
  "hawthorn",
  "kelp",
  "kola",
  "lobelia",
  "moss",
  "sileris",
  "skullcap",
  "valerian",
];
const mineralList = [
  "stannum",
  "arsenic",
  "cuprum",
  "magnesium",
  "gypsum",
  "cinnabar",
  "antimony",
  "ferrum",
  "plumbum",
  "calamine",
  "potash",
  "aurum",
  "quartz",
  "argentum",
  "quicksilver",
  "malachite",
  "realgar",
];

const Precache = ({ cacheTable, setCacheTable }) => {
  return (
    <div style={{ display: "flex" }}>
      <Typography component={"div"} sx={{ margin: "10px" }}>
        {herbList.map((herb) => (
          <GroupedButtons
            key={herb}
            curative={herb}
            precache={cacheTable}
            setCacheTable={setCacheTable}
          />
        ))}
      </Typography>
      <Typography component={"div"} sx={{ margin: "10px" }}>
        {mineralList.map((mineral) => (
          <GroupedButtons
            key={mineral}
            curative={mineral}
            precache={cacheTable}
            setCacheTable={setCacheTable}
          />
        ))}
      </Typography>
    </div>
  );
};

export default Precache;
