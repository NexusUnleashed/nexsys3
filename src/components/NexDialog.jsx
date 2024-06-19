/* global globalThis */
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Dialog,
  Alert,
  AlertTitle,
  Collapse,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Configuration from "./Configuration";

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: "#FFF5D6",
      //secondary: 'green'
    },
  },
  typography: {
    fontSize: 12 * (14 / 16), // conversion for px
    fontFamily: ["Robot Mono", "Consolas", "Montserrat", "monospace"].join(","),
  },
});

darkTheme = createTheme(darkTheme, {
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

const VersionAlert = ({
  handleUpdateClick,
  version,
  currentVersion,
  //update,
}) => {
  if (version !== currentVersion) {
    return (
      <Alert
        severity="info"
        sx={{ fontSize: "12px" }}
        action={
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={handleUpdateClick}
          >
            UPDATE
          </Button>
        }
      >
        <AlertTitle sx={{ fontSize: "14px" }}>
          nexSys Update Available
        </AlertTitle>
        You are using version <strong>{version}</strong> version{" "}
        <strong>{currentVersion || "ERROR"}</strong> is available now.
      </Alert>
    );
  }
  return (
    <Alert severity="success" sx={{ fontSize: "12px" }}>
      <AlertTitle sx={{ fontSize: "14px" }}>nexSys updated</AlertTitle>
      <span>You are using the latest version of nexSys!</span>
      <span>
        <strong> Congratulations!</strong>
      </span>
    </Alert>
  );
};

const NexDialog = ({ evt, nexSys }) => {
  const [open, setOpen] = useState(false);
  const [_nexSys, setNexSys] = useState(nexSys);
  const [sys, setSys] = useState(nexSys.sys);
  const [cacheTable, setCacheTable] = useState(nexSys.cacheTable);
  const [defPriosStatic, setDefPriosStatic] = useState(nexSys.defPrios.static);
  const [defPriosKeepup, setDefPriosKeepup] = useState(nexSys.defPrios.keepup);
  const [affTablePrios, setAffTablePrios] = useState(nexSys.affTable.prios);
  const [affTablePrioArrays, setAffTablePrioArrays] = useState(
    nexSys.affTable.prioArrays
  );
  const [currentVersion, setCurrentVersion] = useState(nexSys.currentVersion);
  const [count, setCount] = useState(0);
  //const [updateAvailable, setUpdateAvailable] = useState(false);

  /*
  // Moved to useEffect lifecycle event
  evt.addEventListener("nexSys-config-dialog", ({ detail }) => {
    if (nexSys.system_loaded) {
      setOpen(detail);
      checkForUpdate();
    }
  });
  */

  const checkForUpdate = async () => {
    await fetch("https://registry.npmjs.org/nexsys/", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setCurrentVersion(data["dist-tags"].latest);
      });
  };

  useEffect(() => {
    //Open/closer function
    const opener = ({ detail }) => {
      if (nexSys.system_loaded) {
        setOpen(detail);
        checkForUpdate();
        setAffTable({ ...nexSys.affTable });
        setDefPrios({ ...nexSys.defPrios });
        setSys({ ...nexSys.sys });
      }
    };

    // Add event listener when component mounts
    evt.addEventListener("nexSys-config-dialog", opener);

    // Return a cleanup function to remove event listener when component unmounts
    return () => {
      evt.removeEventListener("nexSys-config-dialog", opener);
    };
  }, [evt]);

  /*useEffect(() => {
    setUpdateAvailable(nexSys.version !== currentVersion);
  }, [currentVersion]);*/

  useEffect(() => {
    setNexSys((prev) => ({ ...prev, defPrios: { ...defPrios } }));
  }, [defPrios]);

  useEffect(() => {
    setNexSys((prev) => ({ ...prev, sys: { ...sys } }));
  }, [sys]);

  useEffect(() => {
    setNexSys((prev) => ({ ...prev, affTable: { ...affTable } }));
  }, [affTable]);

  useEffect(() => {
    checkForUpdate();
  }, []);

  const handleUpdateClick = () => {
    nexSys.updateNxs();
    nexSys.version = currentVersion;
    setCount((prev) => prev + 1); // Hack way to force rerender on click
  };

  const handleClickClose = () => {
    setOpen(false);
    setTimeout(() => {
      globalThis.nexusclient.platform().inputRef.current.focus();
      globalThis.nexusclient.platform().inputRef.current.select();
    }, 250);
  };

  const handleClickSave = () => {
    nexSys.updateAndSaveModel("cacheSettings", _nexSys.cacheTable);
    nexSys.updateAndSaveModel("systemSettings", _nexSys.sys.settings);
    nexSys.updateAndSaveModel("defSettings", _nexSys.defPrios);
    nexSys.updateAndSaveModel("affSettings", _nexSys.affTable);
    nexSys.updatePriorities();
    eventStream.raiseEvent(
      "CommandSeparatorSetOnStartup",
      _nexSys.sys.settings.sep
    );

    handleClickClose();
  };

  console.log(currentVersion);

  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <Dialog
          open={open}
          onClose={handleClickClose}
          //hideBackdrop={true}
          maxWidth="md"
        >
          <DialogTitle>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>nexSys Configuration Options</span>
              <span>version: {nexSys.version} </span>
            </div>
          </DialogTitle>
          <DialogContent sx={{ background: "#121212" }}>
            {
              <Collapse
                in={
                  typeof currentVersion !== "undefined" &&
                  nexSys.version !== currentVersion
                }
              >
                <VersionAlert
                  //update={updateAvailable}
                  version={nexSys.version}
                  currentVersion={currentVersion}
                  handleUpdateClick={handleUpdateClick}
                />
              </Collapse>
            }
            <Configuration
              theme={darkTheme}
              nexSys={_nexSys}
              setNexSys={setNexSys}
              sys={sys}
              setSys={setSys}
              cacheTable={cacheTable}
              setCacheTable={setCacheTable}
              affTablePrios={affTablePrios}
              setAffTablePrios={setAffTablePrios}
              affTablePrioArrays={affTablePrioArrays}
              setAffTablePrioArrays={setAffTablePrioArrays}
              defPriosKeepup={defPriosKeepup}
              setDefPriosKeepup={setDefPriosKeepup}
              defPriosStatic={defPriosStatic}
              setDefPriosStatic={setDefPriosStatic}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClickClose}>
              Cancel
            </Button>
            <Button onClick={handleClickSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default NexDialog;
//nexSys.evt.dispatchEvent(new CustomEvent('nexSys-config-dialog', {detail: true}))
