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

const Configuration = ({ nexSys, theme }) => {
  const [value, setValue] = React.useState("2");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
              <Tab label="Curing Priorities" value="2" />
              <Tab label="Defence Priorities" value="3" />
              <Tab label="Precache" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <SystemSettings settings={nexSys.sys.settings} />
          </TabPanel>
          <TabPanel value="2">
            {/*<Dndkit />*/}
            <AffPriorities
              affs={nexSys.affs}
              colors={nexSys.prompt.affAbbrev}
              affPrios={nexSys.affTable.prios}
            />
          </TabPanel>
          <TabPanel value="3">
            <DefencePriorities
              defences={nexSys.defs}
              prios={nexSys.defPrios}
              classList={nexSys.classList}
            />
          </TabPanel>
          <TabPanel value="4">
            <Precache cache={nexSys.cacheTable} />
          </TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
};

export default Configuration;
