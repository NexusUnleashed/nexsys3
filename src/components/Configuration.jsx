import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ThemeProvider } from "@mui/material/styles";

import Precache from "./Precache";
import { CssBaseline } from "@mui/material";
import SystemSettings from "./SystemSettings";
import DefencePriorities from "./DefencePriorities";
import AffPriorities from "./AffPriorities";
import ColorSettings from "./ColorSettings";

const Configuration = ({
  nexSys,
  setNexSys,
  theme,
  defPriosKeepup,
  setDefPriosKeepup,
  defPriosStatic,
  setDefPriosStatic,
  affTablePrios,
  setAffTablePrios,
  affTablePrioArrays,
  setAffTablePrioArrays,
  sys,
  setSys,
}) => {
  const [value, setValue] = useState("1");
  //const [_nexSys, setNexSys] = useState({ ...nexSys });
  const [settings, setSettings] = useState({ ...sys.settings });
  const [cacheTable, setCacheTable] = useState({ ...nexSys.cacheTable });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setSys((prev) => ({ ...prev, settings: { ...settings } }));
  }, [settings]);

  useEffect(() => {
    setNexSys((prev) => ({ ...prev, cacheTable: cacheTable }));
  }, [cacheTable]);

  return (
    <ThemeProvider theme={theme}>
      {/*<CssBaseline />*/}
      <Box sx={{ width: "800px" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable tabs"
            >
              <Tab label="System Settings" value="1" />
              <Tab label="Curing Priorities" value="2" />
              <Tab label="Defence Priorities" value="3" />
              <Tab label="Precache" value="4" />
              <Tab label="Color Settings" value="5" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <SystemSettings settings={settings} setSettings={setSettings} />
          </TabPanel>
          <TabPanel value="2">
            <AffPriorities
              colors={nexSys.prompt.affAbbrev}
              affTablePrios={affTablePrios}
              setAffTablePrios={setAffTablePrios}
              setPrioArrays={nexSys.setPrioArrays}
            />
          </TabPanel>
          <TabPanel value="3">
            <DefencePriorities
              defs={nexSys.defs}
              defPriosKeepup={defPriosKeepup}
              setDefPriosKeepup={setDefPriosKeepup}
              defPriosStatic={defPriosStatic}
              setDefPriosStatic={setDefPriosStatic}
              classList={nexSys.tables.classList}
            />
          </TabPanel>
          <TabPanel value="4">
            <Precache cacheTable={cacheTable} setCacheTable={setCacheTable} />
          </TabPanel>
          <TabPanel value="5">
            <ColorSettings />
          </TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
};

export default Configuration;
