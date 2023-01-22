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
import * as React from "react";
import Configuration from "./Configuration";

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
    fontFamily: "Montserrat,Roboto,Helvetica,Arial,sans-serif",
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

const NexDialog = ({ evt, nexSys }) => {
  const [open, setOpen] = React.useState(false);
  const [_nexSys, setNexSys] = React.useState(nexSys);
  const [sys, setSys] = React.useState(nexSys.sys);
  const [cacheTable, setCacheTable] = React.useState(nexSys.cacheTable);
  const [affTable, setAffTable] = React.useState(nexSys.affTable);
  const [defPrios, setDefPrios] = React.useState(nexSys.defPrios);
  const [updated, setUpdated] = React.useState(false);

  evt.addEventListener("nexSys-config-dialog", ({ detail }) => {
    if (nexSys.system_loaded) {
      setOpen(detail);
    }
  });

  React.useEffect(() => {
    setNexSys((prev) => ({ ...prev, defPrios: { ...defPrios } }));
  }, [defPrios]);

  React.useEffect(() => {
    setNexSys((prev) => ({ ...prev, sys: { ...sys } }));
  }, [sys]);

  React.useEffect(() => {
    setNexSys((prev) => ({ ...prev, affTable: { ...affTable } }));
  }, [affTable]);

  const handleUpdateClick = () => {
    nexSys.updateNxs();
    setUpdated(true);
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
  console.log(updated);
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Dialog
          open={open}
          onClose={handleClickClose}
          hideBackdrop={true}
          maxWidth="md"
        >
          <DialogTitle>Nexsys Configuration Options</DialogTitle>
          <DialogContent sx={{ background: "#121212" }}>
            <Collapse in={nexSys.version !== nexSys.currentVersion && !updated}>
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
                You are using version <strong>{nexSys.version}</strong> version{" "}
                <strong>{nexSys.currentVersion || "update"}</strong> is
                available now.
              </Alert>
            </Collapse>
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
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClickClose}>
              Cancel
            </Button>
            <Button onClick={handleClickSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default NexDialog;
//nexSys.evt.dispatchEvent(new CustomEvent('nexSys-config-dialog', {detail: true}))
