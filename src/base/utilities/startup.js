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

  // Add Roboto, Roboto Mono, and Consolas as selectable fonts
  nexusclient.settings().font_stacks = function () {
    return [
      { name: "Roboto", stack: "Roboto,Montserrat,Helvetica,Arial,sans-serif" },
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
      {
        name: "Garamond",
        stack:
          "Garamond, Baskerville, 'Baskerville Old Face', 'Hoefler Text', 'Times New Roman', serif",
      },
      //{name: 'Monospace (Traditional)', stack: 'monospace'}
      { name: "Monospace (Traditional)", stack: "'LiberationMono', monospace" },
    ];
  };

  // CSS override of Nexus timestamp font.
  // TODO: Make this a function to match the selected font.
  const sty = document.createElement("style");
  sty.id = "nexSysCSS";
  sty.textContent = `.mono {font-family: Roboto Mono}`;
  document.getElementsByTagName("head")[0].appendChild(sty);
};
