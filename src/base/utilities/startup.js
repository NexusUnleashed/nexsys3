/* global ReactDOM, React, nexSys */

export const startup = () => {
  if (typeof ReactDOM === "undefined") {
    return;
  }

  fetch("https://registry.npmjs.org/nexsys/", { cache: "no-store" })
    .then((response) => response.json())
    .then((data) => (nexSys.currentVersion = data["dist-tags"].latest));

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
};
