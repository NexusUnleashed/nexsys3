/* global ReactDOM, React, nexSys */

import { saveCustomSettings } from "../system/customsettings";

export const startup = () => {
  if (typeof ReactDOM === "undefined") {
    return;
  }

  //Check if the universal modal parent for Nex packages is present
  //If not present, create it
  if (!document.getElementById("modal-root")) {
    document
      .getElementsByTagName("body")[0]
      .appendChild(
        Object.assign(document.createElement("div"), { id: "modal-root" })
      );
  }

  //Safety check. If the nexsys-modal already exists, remove it and start fresh
  document.getElementById("nexsys-modal")?.remove();
  document
    .getElementById("modal-root")
    .appendChild(
      Object.assign(document.createElement("div"), { id: "nexsys-modal" })
    );

  //Mount the nexSys modal to the previously created div
  const container = document.getElementById("nexsys-modal");
  const root = ReactDOM.createRoot(container);
  root.render(
    React.createElement(nexSys.component, { evt: nexSys.evt, nexSys: nexSys })
  );

  /* ReactDOM.render is deprecated in v18
  ReactDOM.render(
    React.createElement(nexSys.component, { evt: nexSys.evt, nexSys: nexSys }),
    document.getElementById("nexsys-modal")
  );
*/

  if (typeof nexusclient.variables().vars.nexSysSettings === "undefined") {
    nexusclient.variables().vars.nexSysSettings = {};
    saveCustomSettings();
  }
  //nexSys.evt.dispatchEvent(new CustomEvent('nexSys-config-dialog', {detail: true}))

  // Roboto font
  const robotoFont = document.createElement("link");
  robotoFont.rel = "stylesheet";
  robotoFont.href =
    "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";
  document.getElementsByTagName("head")[0].appendChild(robotoFont);
  const robotoMonoFont = document.createElement("link");
  robotoMonoFont.rel = "stylesheet";
  robotoMonoFont.href =
    "https://fonts.googleapis.com/css?family=Roboto%20Mono:300,400,500,700&display=swap";
  document.getElementsByTagName("head")[0].appendChild(robotoMonoFont);

  if (typeof nexusclient.settings().font_stacks_original === "undefined") {
    // CSS override of Nexus timestamp font.
    const sty = document.createElement("style");
    sty.id = "nexSysCSS";
    // Add Roboto, Roboto Mono, and Consolas as selectable fonts
    nexusclient.settings().font_stacks_original =
      nexusclient.settings().font_stacks;
    nexusclient.settings().font_stacks = function () {
      sty.textContent = `.timestamp {font-family: ${
        nexusclient.settings().font_stack
      }}`;
      document.getElementsByTagName("head")[0].appendChild(sty);
      return [
        {
          name: "RobotoMono",
          stack: "Roboto Mono,Consolas,monospace",
        },
        {
          name: "Consolas",
          stack: "Consolas,RobotoMono,monospace",
        },
        { name: "Verdana", stack: "Verdana, Geneva, sans-serif" },
        {
          name: "Lucida",
          stack:
            "'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif",
        },
        {
          name: "Arial",
          stack: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        },
        { name: "Futura", stack: "Futura, 'Trebuchet MS', Arial, sans-serif" },
        {
          name: "Book Antiqua",
          stack:
            "'Book Antiqua', Palatino, 'Palatino Linotype', 'Palatino LT STD', Georgia, serif",
        },
        ...nexusclient.settings().font_stacks_original(),
      ];
    };
  }
};
