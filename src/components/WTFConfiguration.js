import * as React from "react";
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

const WTFConfiguration = ({ nexSys, theme, defPrios, setDefPrios, affTable, setAffTable, sys, setSys }) => {
  const [value, setValue] = React.useState("1");
  const [_nexSys, setNexSys] = React.useState({ ...nexSys });
  const [settings, setSettings] = React.useState({ ...sys.settings });
  const [cacheTable, setCacheTable] = React.useState({ ...nexSys.cacheTable });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    console.log('-----');
    console.log(settings);
    console.log(globalThis.nexSys.sys.settings);
    setSys({ ...settings });
  }, [settings]);

  React.useEffect(() => {
    console.log('//////');
    console.log(cacheTable);
    console.log(globalThis.nexSys.cacheTable);
    //setSys({ ...cacheTable });
  }, [cacheTable]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: "500px", height: "600px" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable tabs"
            >
              <Tab label="System Settings" value="1" />
              <Tab label="Precache" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <SystemSettings settings={settings} setSettings={setSettings} />
          </TabPanel>
          <TabPanel value="4">
            <Precache cacheTable={cacheTable} setCacheTable={setCacheTable} />
          </TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
};

export default WTFConfiguration;
