/* global ReactDOM, React, nexSys */

export const startup = () => {
  if (typeof ReactDOM === 'undefined') { return; }

  if (!document.getElementById("modal-root")) {
    document
      .getElementsByTagName('body')[0]
      .appendChild(
        Object.assign(document.createElement("div"), { id: "modal-root" })
      );
  }

  document
      .getElementById('modal-root')
      .appendChild(
        Object.assign(document.createElement("div"), { id: "nexsys-modal" })
      );


  ReactDOM.render(
    React.createElement(nexSys.component, { evt: nexSys.evt, nexSys: nexSys }),
    document.getElementById("nexsys-modal")
  );
  
  //nexSys.evt.dispatchEvent(new CustomEvent('nexSys-config-dialog', {detail: true}))
};