/* global nexSys */

import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Typography } from "@mui/material";

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

const GroupedButtons = ({ curative, precache, setCacheTable }) => {
  const [count, setCount] = React.useState(precache[curative] || 0);

  const handleIncrement = () => {
    setCount((count) => count + 1);
  };

  const handleDecrement = () => {
    if (count === 0) {
      return;
    }
    setCount((count) => count - 1);
  };

  React.useEffect(() => {
    setCacheTable((prev) => ({ ...prev, [curative]: count }));
  }, [count]);

  return (
    <div>
      <ButtonGroup size="small" aria-label="small outlined button group">
        <Button disabled={count === 0} onClick={handleDecrement}>
          -
        </Button>
        <Button disabled={count === 0}>{count}</Button>
        <Button onClick={handleIncrement}>+</Button>
      </ButtonGroup>
      {curative}
    </div>
  );
};

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
