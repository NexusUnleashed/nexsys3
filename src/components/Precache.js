/* global nexSys */

import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Typography } from "@mui/material";

const GroupedButtons = ({ curative, precache }) => {
  const [cache, setCache] = React.useState(precache[curative] || 0);

  const handleIncrement = () => {
    setCache((cache) => cache + 1);
  };

  const handleDecrement = () => {
    if (cache === 0) {
      return;
    }
    setCache((cache) => cache - 1);
  };

  React.useEffect(() => {
    nexSys.cacheTable[curative] = cache;
  }, [cache, curative]);

  return (
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button disabled={cache === 0} onClick={handleDecrement}>
        -
      </Button>
      <Button disabled={cache === 0}>{cache}</Button>
      <Button onClick={handleIncrement}>+</Button>
    </ButtonGroup>
  );
};

const Precache = ({ cache }) => {
  return (
    <div style={{ display: "flex" }}>
      <Typography component={"div"} sx={{ margin: "10px" }}>
        <div>
          <GroupedButtons curative={"ash"} precache={cache} /> Ash
        </div>
        <div>
          <GroupedButtons curative={"bayberry"} precache={cache} /> Bayberry
        </div>
        <div>
          <GroupedButtons curative={"bellwort"} precache={cache} /> Bellwort
        </div>
        <div>
          <GroupedButtons curative={"bloodroot"} precache={cache} /> Bloodroot
        </div>
        <div>
          <GroupedButtons curative={"cohosh"} precache={cache} /> Cohosh
        </div>
        <div>
          <GroupedButtons curative={"elm"} precache={cache} /> Elm
        </div>
        <div>
          <GroupedButtons curative={"ginger"} precache={cache} /> Ginger
        </div>
        <div>
          <GroupedButtons curative={"ginseng"} precache={cache} /> Ginseng
        </div>
        <div>
          <GroupedButtons curative={"goldenseal"} precache={cache} /> Goldenseal
        </div>
        <div>
          <GroupedButtons curative={"hawthorn"} precache={cache} /> Hawthorn
        </div>
        <div>
          <GroupedButtons curative={"moss"} precache={cache} /> Irid Moss
        </div>
        <div>
          <GroupedButtons curative={"kelp"} precache={cache} /> Kelp
        </div>
        <div>
          <GroupedButtons curative={"kola"} precache={cache} /> Kola
        </div>
        <div>
          <GroupedButtons curative={"lobelia"} precache={cache} /> Lobelia
        </div>
        <div>
          <GroupedButtons curative={"sileris"} precache={cache} /> Sileris
        </div>
        <div>
          <GroupedButtons curative={"skullcap"} precache={cache} /> Skullcap
        </div>
        <div>
          <GroupedButtons curative={"valerian"} precache={cache} /> Valerian
        </div>
      </Typography>
      <Typography component={"div"} sx={{ margin: "10px" }}>
        <div>
          <GroupedButtons curative={"stannum"} precache={cache} /> Stannum
        </div>
        <div>
          <GroupedButtons curative={"arsenic"} precache={cache} /> Arsenic
        </div>
        <div>
          <GroupedButtons curative={"cuprum"} precache={cache} /> Cuprum
        </div>
        <div>
          <GroupedButtons curative={"magnesium"} precache={cache} /> Magnesium
        </div>
        <div>
          <GroupedButtons curative={"gypsum"} precache={cache} /> Gypsum
        </div>
        <div>
          <GroupedButtons curative={"cinnabar"} precache={cache} /> Cinnabar
        </div>
        <div>
          <GroupedButtons curative={"antimony"} precache={cache} /> Antimony
        </div>
        <div>
          <GroupedButtons curative={"ferrum"} precache={cache} /> Ferrum
        </div>
        <div>
          <GroupedButtons curative={"plumbum"} precache={cache} /> Plumbum
        </div>
        <div>
          <GroupedButtons curative={"calamine"} precache={cache} /> Calamine
        </div>
        <div>
          <GroupedButtons curative={"potash"} precache={cache} /> Potash
        </div>
        <div>
          <GroupedButtons curative={"aurum"} precache={cache} /> Aurum
        </div>
        <div>
          <GroupedButtons curative={"quartz"} precache={cache} /> Quartz
        </div>
        <div>
          <GroupedButtons curative={"argentum"} precache={cache} /> Argentum
        </div>
        <div>
          <GroupedButtons curative={"quicksilver"} precache={cache} />{" "}
          Quicksilver
        </div>
        <div>
          <GroupedButtons curative={"malachite"} precache={cache} /> Malachite
        </div>
        <div>
          <GroupedButtons curative={"realgar"} precache={cache} /> Realgar
        </div>
      </Typography>
    </div>
  );
};

export default Precache;
