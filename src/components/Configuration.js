import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Precache from "./Precache";
import PriorityList from "./Prioritylist";

const Configuration = () => {
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="System Settings" value="1" />
            <Tab label="Curing Priorities" value="2" />
            <Tab label="Defence Priorities" value="3" />
            <Tab label="Precache" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">
          <PriorityList
            affs={[
              [
                {
                  id: "paralysis",
                },
                {
                  id: "asthma",
                },
                {
                  id: "nausea",
                },
              ],
              [
                {
                  id: "weariness",
                },
                {
                  id: "darkshade",
                },
                {
                  id: "hallucinations",
                },
              ],
            ]}
          />
        </TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">
          <Precache />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

/*<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
    <Tab label="Item One" {...a11yProps(0)} />
    <Tab label="Item Two" {...a11yProps(1)} />
    <Tab label="Item Three" {...a11yProps(2)} />
  </Tabs>
</Box>
<TabPanel value={value} index={0}>
  Item One
</TabPanel>
<TabPanel value={value} index={1}>
  Item Two
</TabPanel>
<TabPanel value={value} index={2}>
  Item Three
</TabPanel>
*/
export default Configuration;
