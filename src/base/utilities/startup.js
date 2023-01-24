/* global ReactDOM, React, nexSys */

export const startup = () => {
  if (typeof ReactDOM === "undefined") {
    return;
  }

  nexSys.checkForUpdate();

  if (!document.getElementById("modal-root")) {
    document
      .getElementsByTagName("body")[0]
      .appendChild(
        Object.assign(document.createElement("div"), { id: "modal-root" })
      );
  }

  document.getElementById("nexsys-modal")?.remove();
  document
    .getElementById("modal-root")
    .appendChild(
      Object.assign(document.createElement("div"), { id: "nexsys-modal" })
    );

  ReactDOM.render(
    React.createElement(nexSys.component, { evt: nexSys.evt, nexSys: nexSys }),
    document.getElementById("nexsys-modal")
  );

  if (typeof nexusclient.variables().vars.nexSysSettings === "undefined") {
    nexusclient.variables().vars.nexSysSettings = {};
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
};
