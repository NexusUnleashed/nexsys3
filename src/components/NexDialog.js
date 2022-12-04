/* global globalThis */
import { DialogContent, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
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

const NexDialog = ({ evt, nexSys }) => {
  const [open, setOpen] = React.useState(false);

  evt.addEventListener("nexSys-config-dialog", ({ detail }) => {
    setOpen(detail);
  });

  const handleClickClose = () => {
    setOpen(false);
    setTimeout(() => {
      globalThis.nexusclient.platform().inputRef.current.focus();
      globalThis.nexusclient.platform().inputRef.current.select();
    }, 250);
  };

  const handleClickSave = () => {
    nexSys.saveModel("cacheSettings", nexSys.cacheTable);
    nexSys.saveModel("systemSettings", nexSys.sys.settings);
    handleClickClose()
  };

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Dialog
          open={open}
          onClose={handleClickClose}
          hideBackdrop={true}
          style={{ pointerEvents: "none" }}
          maxWidth="md"
        >
          <DialogTitle>Nexsys Configuration Options</DialogTitle>
          <DialogContent>
            <Configuration theme={darkTheme} nexSys={nexSys} />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClickClose}>Cancel</Button>
            <Button onClick={handleClickSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default NexDialog;
