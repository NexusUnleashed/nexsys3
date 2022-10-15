import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import Precache from "./Precache";
import Dndkit from "./Dndkit";

const Configuration = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const affs = Array.from(Array(26)).fill([],0);
  affs[0] = ["bound",
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
  affs[1] = ["addiction",
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

        </TabPanel>
        <TabPanel value="3">
          <Dndkit/>
        </TabPanel>
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
