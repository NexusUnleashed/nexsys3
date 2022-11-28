/* global ReactDOM, React, nexsys */

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
    React.createElement(nexsys.component, { evt: nexsys.evt, nexsys: nexsys }),
    document.getElementById("modal-root")
  );

  //nexsys.evt.dispatchEvent(new CustomEvent('nexsys-config-dialog', {detail: true}))
};
