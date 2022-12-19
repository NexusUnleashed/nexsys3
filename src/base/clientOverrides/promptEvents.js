/* global eventStream, nexSys */

let setPromptVitals = function (vitals) {
    let vars = nexSys.prompt.vars;
    vars.h.text = vitals.h;
    vars.m.text = vitals.m;
    vars.e.text = vitals.e;
    vars.w.text = vitals.w;
    vars.xp.text = vitals.xp;
    vars.rage.text = vitals.rage > 0 ? vitals.rage : "";
    vars.maxh.text = vitals.maxh;
    vars.maxm.text = vitals.maxm;
    vars.maxe.text = vitals.maxe;
    vars.maxw.text = vitals.maxw;
    vars.bleed.text = vitals.bleed;
    vars.rage.text = vitals.rage;

    let perch = vitals.h * 100 / vitals.maxh;
    let percm = vitals.m * 100 / vitals.maxm;
    let perce = vitals.e * 100 / vitals.maxe;
    let percw = vitals.w * 100 / vitals.maxw;

    vars.h.fg = nexSys.prompt.colorPercentage(perch);
    vars.m.fg = nexSys.prompt.colorPercentage(percm);
    vars.e.fg = nexSys.prompt.colorPercentage(perce);
    vars.w.fg = nexSys.prompt.colorPercentage(percw);

    vars.ph.text = perch.toFixed(1) + "%";
    vars.pm.text = percm.toFixed(1) + "%";
    vars.pe.text = perce.toFixed(1) + "%";
    vars.pw.text = percw.toFixed(1) + "%";
};
/********** */
let setPromptAffs = function (promptAffs) {
    //let affs = nexSys.prompt.vars.affs;

    let affLine = document.createElement('span');

    const affs = Object.keys(promptAffs);

    if (affs.length === 0) { return affLine; }

    let affAbbrev = nexSys.prompt.affAbbrev;

    let add = (txt, fg, bg) => {
        affLine.appendChild(nexSys.prompt.generate_chunk(txt, fg, bg));
    };
    
    add("[");
    for (let i = 0; i < affs.length; i++) {
        const aff = affs[i];

        const fg = affAbbrev[aff] ? affAbbrev[aff].fg : "";
        const bg = affAbbrev[aff] ? affAbbrev[aff].bg : "";
        const txt = affAbbrev[aff] ? affAbbrev[aff].text : aff;
        const count = promptAffs[aff] === true ? "" : `(${promptAffs[aff]})`;
        const pre = i > 0 ? ", " : "";
        add(`${pre}${txt}${count}`, fg, bg);
    }
    add("]");

    return affLine;
};
/**********/
let gotPromptAff = function (aff) {
    let affs = nexSys.prompt.vars.affs;
    affs[aff.name] = aff.count || true;

    nexSys.prompt.vars.affString = setPromptAffs(affs);
};

let lostPromptAff = function (aff) {
    let affs = nexSys.prompt.vars.affs;
    delete affs[aff.name];
    //affs[aff.name] = false;

    nexSys.prompt.vars.affString = setPromptAffs(affs);
};

let setPromptDefs = function (args) {
    nexSys.prompt.vars.c.text = nexSys.defs.cloak.have ? "c" : "";
    nexSys.prompt.vars.k.text = nexSys.defs.kola.have ? "k" : "";
    nexSys.prompt.vars.d.text = nexSys.affs.deafness.have ? "" : "d";
    nexSys.prompt.vars.b.text = nexSys.affs.blindness.have ? "" : "b";
};

let setPromptBals = function (args) {
    nexSys.prompt.vars.eq.text = nexSys.bals.balance.have ? "x" : "";
    nexSys.prompt.vars.bal.text = nexSys.bals.equilibrium.have ? "e" : "";
};

let setHealthDiffPrompt = function (args) {
    nexSys.prompt.vars.diffh.text = args.diff < 0 ? "(" + args.diff + ")h" : "(+" + args.diff + ")h";
    nexSys.prompt.vars.diffh.fg = args.diff < 0 ? "red" : "green";
};

let setManaDiffPrompt = function (args) {
    nexSys.prompt.vars.diffm.text = args.diff < 0 ? "(" + args.diff + ")m" : "(+" + args.diff + ")m";
    nexSys.prompt.vars.diffm.fg = args.diff < 0 ? "red" : "green";
};


eventStream.registerEvent('AffGot', gotPromptAff);
eventStream.registerEvent('AffLost', lostPromptAff);
eventStream.registerEvent('SystemLoaded', setPromptDefs);
eventStream.registerEvent('DefGot', setPromptDefs);
eventStream.registerEvent('DefLost', setPromptDefs);
eventStream.registerEvent('SystemLoaded', setPromptBals);
eventStream.registerEvent('BalanceGot', setPromptBals);
eventStream.registerEvent('BalanceLost', setPromptBals);
eventStream.registerEvent('SystemCharVitalsUpdated', setPromptVitals);
eventStream.registerEvent('HealthUpdated', setHealthDiffPrompt);
eventStream.registerEvent('ManaUpdated', setManaDiffPrompt);
eventStream.registerEvent('SystemPaused', function (args) { nexSys.prompt.vars.paused.text = "(p)"; });
eventStream.registerEvent('SystemUnpaused', function (args) { nexSys.prompt.vars.paused.text = ""; });
eventStream.registerEvent('aeonLostAffEvent', function (args) { nexSys.prompt.vars.aeon.text = ""; });
eventStream.registerEvent('aeonGotAffEvent', function (args) { nexSys.prompt.vars.aeon.text = "(a)"; });
eventStream.registerEvent('SystemSlowModeOn', function (args) { nexSys.prompt.vars.retard.text = "(r)"; });
eventStream.registerEvent('SystemSlowModeOff', function (args) { nexSys.prompt.vars.retard.text = ""; });