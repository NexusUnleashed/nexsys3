import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ThemeProvider } from "@mui/material/styles";

import Precache from "./Precache";
import Dndkit from "./Dndkit";
import { CssBaseline } from "@mui/material";
import SystemSettings from "./SystemSettings";

const Configuration = ({ nexsys, theme }) => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const affs = Array.from(Array(26)).fill([], 0);
  affs[0] = [
    "bound",
    "brokenleftarm",
    "brokenrightarm",
    "brokenleftleg",
    "brokenrightleg",
    "bruisedribs",
    "burning",
    "cadmuscurse",
    "calcifiedskull",
    "calcifiedtorso",
    "claustrophobia",
  ];
  affs[1] = [
    "addiction",
    "aeon",
    "agoraphobia",
    "airfisted",
    "amnesia",
    "anorexia",
    "asphyxiating" /**/,
    "asthma",
    "blackout",
    "bleeding",
    "blindness",
    "blistered" /**/,
    "bloodfire" /**/,
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: "500px", height: '600px' }}>
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
            </TabList>
          </Box>
          <TabPanel value="1">
            <SystemSettings settings={nexsys.sys.settings} />
          </TabPanel>
          <TabPanel value="2">
            Dndkit {/*<Dndkit />*/}
          </TabPanel>
          <TabPanel value="3"></TabPanel>
          <TabPanel value="4">
            <Precache cache={nexsys.cacheTable}/>
          </TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
};

export default Configuration;
