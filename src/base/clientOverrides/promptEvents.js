/* global eventStream, nexsys */

let setPromptVitals = function (vitals) {
    let vars = nexsys.prompt.vars;
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

    vars.h.fg = nexsys.prompt.colorPercentage(perch);
    vars.m.fg = nexsys.prompt.colorPercentage(percm);
    vars.e.fg = nexsys.prompt.colorPercentage(perce);
    vars.w.fg = nexsys.prompt.colorPercentage(percw);

    vars.ph.text = perch.toFixed(1) + "%";
    vars.pm.text = percm.toFixed(1) + "%";
    vars.pe.text = perce.toFixed(1) + "%";
    vars.pw.text = percw.toFixed(1) + "%";
};
/********** */
let setPromptAffs = function () {
    let affs = nexsys.prompt.vars.affs;

    if (Object.keys(affs).length === 0) { return; }

    let affAbbrev = nexsys.prompt.affAbbrev;
    let affLine = document.createElement('span');

    let add = (txt, fg, bg) => {
        affLine.appendChild(nexsys.prompt.generate_chunk(txt, fg, bg))
    }

    for (let aff in affs) {
        if (affs[aff] === true) {
            if (affAbbrev[aff]) {
                add(affAbbrev[aff].text, affAbbrev[aff].fg, affAbbrev[aff].bg);
            } else {
                add(aff);
            }
        }
        else {
            if (affAbbrev[aff]) {
                add(`${affAbbrev[aff].text}(${affs[aff]})`, affAbbrev[aff].fg, affAbbrev[aff].bg);
            } else {
                add(`${aff}(${affs[aff]})`);
            }
        }
    }

    nexsys.prompt.vars.affString = affLine;
};
/**********/
let gotPromptAff = function (aff) {
    let affs = nexsys.prompt.vars.affs;
    affs[aff.name] = aff.count || true;

    setPromptAffs();
};

let lostPromptAff = function (aff) {
    let affs = nexsys.prompt.vars.affs;
    affs[aff.name] = false;

    setPromptAffs();
};

let setPromptDefs = function (args) {
    nexsys.prompt.vars.c.text = nexsys.defs.cloak.have ? "c" : "";
    nexsys.prompt.vars.k.text = nexsys.defs.kola.have ? "k" : "";
    nexsys.prompt.vars.d.text = nexsys.affs.deafness.have ? "" : "d";
    nexsys.prompt.vars.b.text = nexsys.affs.blindness.have ? "" : "b";
};

let setPromptBals = function (args) {
    nexsys.prompt.vars.eq.text = nexsys.bals.balance.have ? "x" : "";
    nexsys.prompt.vars.bal.text = nexsys.bals.equilibrium.have ? "e" : "";
};

let setHealthDiffPrompt = function (args) {
    nexsys.prompt.vars.diffh.text = args.diff < 0 ? "(" + args.diff + ")h" : "(+" + args.diff + ")h";
    nexsys.prompt.vars.diffh.fg = args.diff < 0 ? "red" : "green";
};

let setManaDiffPrompt = function (args) {
    nexsys.prompt.vars.diffm.text = args.diff < 0 ? "(" + args.diff + ")m" : "(+" + args.diff + ")m";
    nexsys.prompt.vars.diffm.fg = args.diff < 0 ? "red" : "green";
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
eventStream.registerEvent('SystemPaused', function (args) { nexsys.prompt.vars.paused.text = "(p)"; });
eventStream.registerEvent('SystemUnpaused', function (args) { nexsys.prompt.vars.paused.text = ""; });
eventStream.registerEvent('aeonLostAffEvent', function (args) { nexsys.prompt.vars.aeon.text = ""; });
eventStream.registerEvent('aeonGotAffEvent', function (args) { nexsys.prompt.vars.aeon.text = "(a)"; });
eventStream.registerEvent('SystemSlowModeOn', function (args) { nexsys.prompt.vars.retard.text = "(r)"; });
eventStream.registerEvent('SystemSlowModeOff', function (args) { nexsys.prompt.vars.retard.text = ""; });