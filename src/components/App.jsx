/* global */
import Configuration from "./Configuration";
import { createTheme } from "@mui/material/styles";
import NexDialog from "./NexDialog";
import "../base/utilities/helpers";
import * as React from "react";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#FFF5D6",
      //secondary: 'green'
    },
  },
  typography: {
    fontSize: 12 * (14 / 16), // conversion for px
    fontFamily: ["Arial"],
  },
  components: {
    MuiList: {
      defaultProps: {
        sx: { color: "#FFF5D6" },
      },
    },
    MuiFormControlLabel: {
      defaultProps: {
        sx: { color: "#FFF5D6" },
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiPopover: {
      styleOverrides: {
        // Name of the slot
        paper: {
          // Some CSS
          background: "black",
          border: "1px solid white",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        determinate: {
          transition: "none",
          background: "blue",
        },
      },
    },
  },
});

function App({ nexSys }) {
  const [_nexSys, setNexSys] = React.useState(nexSys);
  const [sys, setSys] = React.useState(nexSys.sys);
  const [cacheTable, setCacheTable] = React.useState(nexSys.cacheTable);
  const [affTable, setAffTable] = React.useState(nexSys.affTable);
  const [defPrios, setDefPrios] = React.useState(nexSys.defPrios);

  nexSys.system_loaded = true;
  return (
    <div style={{ background: "black" }}>
      <NexDialog evt={globalThis.nexSys.evt} nexSys={globalThis.nexSys} />
      <Configuration
        theme={darkTheme}
        nexSys={_nexSys}
        setNexSys={setNexSys}
        sys={sys}
        setSys={setSys}
        cacheTable={cacheTable}
        setCacheTable={setCacheTable}
        affTable={affTable}
        setAffTable={setAffTable}
        defPrios={defPrios}
        setDefPrios={setDefPrios}
      />
    </div>
  );
}

export default App;
