/* global eventStream, nexSys */

const setPromptVitals = function (vitals) {
  let vars = nexSys.prompt.vars;
  vars.h.text = vitals.h;
  vars.m.text = vitals.m;
  vars.e.text = vitals.e;
  vars.w.text = vitals.w;
  vars.xp.text = vitals.xp;
  vars.maxh.text = vitals.maxh;
  vars.maxm.text = vitals.maxm;
  vars.maxe.text = vitals.maxe;
  vars.maxw.text = vitals.maxw;

  vars.bleed.text = vitals.bleed;
  vars.rage.text = vitals.rage;

  vars.karma.text = vitals.karma || "";
  vars.age.text = vitals.age || "";
  vars.essence.text = vitals.essence || "";

  let perch = (vitals.h * 100) / vitals.maxh;
  let percm = (vitals.m * 100) / vitals.maxm;
  let perce = (vitals.e * 100) / vitals.maxe;
  let percw = (vitals.w * 100) / vitals.maxw;

  vars.h.fg = nexSys.prompt.colorGradation(perch); //nexSys.prompt.colorPercentage(perch);
  vars.m.fg = nexSys.prompt.colorGradation(percm); //nexSys.prompt.colorPercentage(percm);
  vars.e.fg = nexSys.prompt.colorGradation(perce); //nexSys.prompt.colorPercentage(perce);
  vars.w.fg = nexSys.prompt.colorGradation(percw); //nexSys.prompt.colorPercentage(percw);

  vars.ph.text = perch.toFixed(1) + "%";
  vars.pm.text = percm.toFixed(1) + "%";
  vars.pe.text = perce.toFixed(1) + "%";
  vars.pw.text = percw.toFixed(1) + "%";

  /*
  vars.ph.value = perch.toFixed(2);
  vars.pm.value = percm.toFixed(2);
  vars.pe.value = perce.toFixed(2);
  vars.pw.value = percw.toFixed(2);
  */
};
/********** */
const setPromptAffs = function (promptAffs) {
  //let affs = nexSys.prompt.vars.affs;

  let affLine = document.createElement("span");
  affLine.className = "mono";

  // TODO: This sorts affs based on priority order for prompt display.
  // How to make this also sort based on order within priority?
  // Do we care?
  const affs = Object.keys(promptAffs).sort((a, b) => {
    let res;
    if (nexSys.affTable.prios[a] > nexSys.affTable.prios[b]) {
      res = 1;
    } else if (nexSys.affTable.prios[a] < nexSys.affTable.prios[b]) {
      res = -1;
    } else {
      const prioArray = nexSys.affTable.prioArrays[nexSys.affTable.prios[a]];
      res = prioArray.indexOf(a) >= prioArray.indexOf(b) ? 1 : -1;
    }
    return res;
  });

  /*
  // Simple sort
  Object.keys(tester).sort((a, b) =>
  nexSys.affTable.prios[a] >= nexSys.affTable.prios[b] ? 1 : -1
  );
  */

  if (affs.length === 0) {
    return affLine;
  }

  let affAbbrev = nexSys.prompt.affAbbrev;

  let add = (txt, fg, bg) => {
    affLine.appendChild(nexSys.prompt.generate_chunk(txt, fg, bg));
  };

  add("[", "brown");
  for (let i = 0; i < affs.length; i++) {
    const aff = affs[i];
    const fg = affAbbrev[aff] ? affAbbrev[aff].fg : "";
    const bg = affAbbrev[aff] ? affAbbrev[aff].bg : "";
    let txt = affAbbrev[aff] ? affAbbrev[aff].text : aff;

    const count = promptAffs[aff] === true ? "" : `(${promptAffs[aff]})`;
    add(
      `${txt}${count}${affs.length > 1 && i < affs.length - 1 ? " " : ""}`,
      fg,
      bg
    );
  }
  add("]", "brown");

  return affLine;
};
/**********/
const gotPromptAff = function (aff) {
  let affs = nexSys.prompt.vars.affs;
  affs[aff.name] = aff.count || true;

  nexSys.prompt.vars.affString = setPromptAffs(affs);
};

const lostPromptAff = function (aff) {
  let affs = nexSys.prompt.vars.affs;
  delete affs[aff.name];
  //affs[aff.name] = false;

  nexSys.prompt.vars.affString = setPromptAffs(affs);
};

const setPromptDefs = function (args) {
  nexSys.prompt.vars.c.text = nexSys.defs.cloak.have ? "c" : "";
  nexSys.prompt.vars.k.text = nexSys.defs.kola.have ? "k" : "";
  nexSys.prompt.vars.d.text = nexSys.affs.deafness.have ? "" : "d";
  nexSys.prompt.vars.b.text = nexSys.affs.blindness.have ? "" : "b";
};

const setPromptBals = function (args) {
  nexSys.prompt.vars.eq.text = nexSys.bals.balance.have ? "x" : "";
  nexSys.prompt.vars.bal.text = nexSys.bals.equilibrium.have ? "e" : "";
};

const setHealthDiffPrompt = function (args) {
  nexSys.prompt.vars.diffhp.text = `${((args.diff / args.max) * 100).toFixed(
    1
  )}%`;
  //nexSys.prompt.vars.diffh.text = `(${args.diff > 0 ? "+" : ""}${args.diff})h`;
  nexSys.prompt.vars.diffh.text = `${args.diff > 0 ? "+" : ""}${args.diff}`;
  nexSys.prompt.vars.diffh.fg = args.diff < 0 ? "red" : "green";
  nexSys.prompt.vars.diffhp.fg = nexSys.prompt.vars.diffh.fg;
};

const setManaDiffPrompt = function (args) {
  nexSys.prompt.vars.diffmp.text = `${((args.diff / args.max) * 100).toFixed(
    1
  )}%`;
  nexSys.prompt.vars.diffm.text = `${args.diff > 0 ? "+" : ""}${args.diff}`;
  nexSys.prompt.vars.diffm.fg = args.diff < 0 ? "red" : "green";
  nexSys.prompt.vars.diffmp.fg = nexSys.prompt.vars.diffm.fg;
};

eventStream.registerEvent("AffGot", gotPromptAff);
eventStream.registerEvent("AffLost", lostPromptAff);
eventStream.registerEvent("SystemLoaded", setPromptDefs);
eventStream.registerEvent("DefGot", setPromptDefs);
eventStream.registerEvent("DefLost", setPromptDefs);
eventStream.registerEvent("SystemLoaded", setPromptBals);
eventStream.registerEvent("BalanceGot", setPromptBals);
eventStream.registerEvent("BalanceLost", setPromptBals);
eventStream.registerEvent("SystemCharVitalsUpdated", setPromptVitals);
eventStream.registerEvent("HealthUpdated", setHealthDiffPrompt);
eventStream.registerEvent("ManaUpdated", setManaDiffPrompt);
eventStream.registerEvent("SystemPaused", function (args) {
  nexSys.prompt.vars.paused.text = "(p)";
});
eventStream.registerEvent("SystemUnpaused", function (args) {
  nexSys.prompt.vars.paused.text = "";
});
eventStream.registerEvent("aeonLostAffEvent", function (args) {
  nexSys.prompt.vars.aeon.text = "";
});
eventStream.registerEvent("aeonGotAffEvent", function (args) {
  nexSys.prompt.vars.aeon.text = "(a)";
});
eventStream.registerEvent("SystemSlowModeOn", function (args) {
  nexSys.prompt.vars.retard.text = "(r)";
});
eventStream.registerEvent("SystemSlowModeOff", function (args) {
  nexSys.prompt.vars.retard.text = "";
});
