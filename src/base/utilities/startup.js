/* global ReactDOM, React, nexSys */

export const startup = () => {
  if (typeof ReactDOM === 'undefined') { return; }

  if (!document.getElementById("modal-root")) {
    document
      .getElementById("root")
      .appendChild(
        Object.assign(document.createElement("div"), { id: "modal-root" })
      );
  }

  ReactDOM.render(
    React.createElement(nexSys.component, { evt: nexSys.evt, nexSys: nexSys }),
    document.getElementById("modal-root")
  );

  //nexSys.evt.dispatchEvent(new CustomEvent('nexSys-config-dialog', {detail: true}))
};
