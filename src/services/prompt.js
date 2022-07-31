export const get_formatted_prompt = (...args) => {
        if (!args[0] || !args[0].length) {
            if(args[0] !== "") { // some variables will send in "", just pretend we're formatting no text
                return;
            }
        }
        let bg;
        let chunk = [];
        let chunks = [];
        let fg;
        let text;
        chunks.length = Math.ceil(args.length / 3);
        chunks = chunks.fill().map((ignore, i) => args.slice(i * 3, i * 3 + 3));
        for (let e of chunks) {
            text = e[0];
            fg = e[1];
            bg = e[2];
            bg = client.convert_bgcolor(bg);
            chunk.push(linechunk_color(fg, bg));
            chunk.push(linechunk_text(text));
        }
        let line = {};
        line.parsed_prompt = linechunks_create(chunk);
        line.no_triggers = true;

        return line;
    };
    
export const getCustomPrompt = () => {
    let vars = nexSys.prompt.vars;
    let diffh = vars.diffh;
    let diffm = vars.diffm;

    vars.diffh = "";
    vars.diffm = "";

    if(vars.blackout) {
        return nexSys.prompt.get_formatted_prompt('-', "reset", "");
    }

    return nexSys.prompt.get_formatted_prompt(
        vars.paused + "", "red", "",
        vars.aeon + "", "red", "",
        vars.retard + "", "blue", "",
        vars.h + "", vars.hcolor, "",
        "(" + vars.ph + "), ", vars.hcolor, "",
        vars.m + "", vars.mcolor, "",
        "(" + vars.pm + "), ", vars.mcolor, "",
        vars.rage + "", "green", "",
        vars.w + ", ", vars.wcolor, "",
        vars.e + " ", vars.ecolor, "",
        vars.eq + vars.bal + "|", "reset", "",
        vars.c + vars.k + vars.d + vars.b + " ", "reset", "",
        vars.target + " ", "green", "",
        vars.kai + "", "reset", "",
        vars.kaitrance + "", "blue", "",
        vars.vitality + "", "purple", "",
        vars.stance + " ", "white", "",
        vars.affString + " ", "brown", "",
        diffh + " ", vars.diffhcolor, "",
        diffm + " ", vars.diffmcolor, ""
    );
};

nexSys.prompt.vars = {
    blackout: false,
    h: "0",
    m: "0",
    e: "0",
    w: "0",
    hcolor: "green",
    mcolor: "green",
    ecolor: "green",
    wcolor: "green",
    rage: "",
    xp: "0",
    maxh: "0",
    maxm: "0",
    maxe: "0",
    maxw: "0",
    ph: "100%",
    pm: "100%",
    pe: "100%",
    pw: "100%",
    diffh: "",
    diffm: "",
    diffhcolor: "green",
    diffmcolor: "green",
    diffxp: "",
    target: "",
    eq: "",
    bal: "",
    c: "",
    k: "",
    d: "",
    b: "",
    affs: {},
    affString: "",
    paused: "",
    retard: "",
    aeon: "",
    kai: "",
    vitality: "",
    kaitrance: "",
    shintrance: "",
    stance: "",
};

nexSys.prompt.affAbbrev = {
    addiction: 'add',
    aeon: 'ae',
    agoraphobia: 'agor',
    airdisrupt: 'adsr',
    amnesia: 'amn',
    anorexia: 'ano',
    asleep: 'asl',
    asthma: 'ast',
    blackout: 'bo',
    blindness: 'unb',
    bound: 'bnd',
    brokenleftarm: 'la1',
    brokenleftleg: 'll1',
    brokenrightarm: 'ra1',
    brokenrightleg: 'rl1',
    bruisedribs: 'ribs',
    burning: 'burn',
    charredburn: '4burn',
    claustrophobia: 'clau',
    clumsiness: 'cl',
    confusion: 'con',
    corruption: 'corr',
    crackedribs: 'cr',
    damagedleftarm: 'la2',
    damagedleftleg: 'll2',
    damagedrightarm: 'ra2',
    damagedrightleg: 'rl2',
    damagedhead: 'hd2',
    darkshade: 'dark',
    dazed: 'dzd',
    deadening: 'dea',
    deafness: 'und',
    dehydrated: 'deh',
    dementia: 'dem',
    disloyalty: 'disl',
    disrupted: 'disr',
    dissonance: 'disso',
    dizziness: 'diz',
    entangled: 'entgl',
    epilepsy: 'epi',
    extremeburn: '3burn',
    fear: 'fear',
    frozen: 'frz',
    generosity: 'gen',
    haemophilia: 'haem',
    hallucinations: 'hall',
    hamstrung: 'hms',
    healthleech: 'hthl',
    heartseed: 'heart',
    hellsight: 'hell',
    hypersomnia: 'hypers',
    hypochondria: 'hypoch',
    hypothermia: 'hypoth',
    icefist: 'ice',
    impaled: 'impl',
    impatience: 'impat',
    itching: 'itch',
    justice: 'just',
    laceratedthroat: 'lac2',
    lethargy: 'let',
    loneliness: 'lon',
    lovers: 'love',
    /*insulation: 'cal',*/
    whisperingmadness: 'mad',
    mangledleftarm: 'la3',
    mangledleftleg: 'll3',
    mangledrightarm: 'ra3',
    mangledrightleg: 'rl3',
    mangledhead: 'hd3',
    masochism: 'maso',
    meltingburn: '5burn',
    mildtrauma: 'tor1',
    nausea: 'nau',
    slimeobscure: 'nkh',
    numbedleftarm: 'nbla',
    numbedrightarm: 'nbra',
    pacified: 'pac',
    paralysis: 'par',
    paranoia: 'prn',
    peace: 'pea',
    phlogistication: 'phlog',
    pinshot: 'psh',
    prone: 'pr',
    recklessness: 'reck',
    retardation: 'ret',
    roped: 'rop',
    sanguinehumour: 'sanH',
    scalded: 'scald',
    scytherus: 'scy',
    selarnia: 'sel',
    sensitivity: 'sen',
    serioustrauma: 'tor2',
    severeburn: '2burn',
    shivering: 'shiv',
    shyness: 'shy',
    skullfractures: 'sf',
    slashedthroat: 'lac1',
    sleeping: 'slp',
    slickness: 'sli',
    //spiritdisrupt: 'sdsr', // CUSTOM
    stain: 'sta',
    stupidity: 'st',
    stuttering: 'stut',
    homunculusmercury: 'merc',
    temperedcholeric: 'choH',
    temperedmelancholic: 'melaH',
    temperedphlegmatic: 'phleH',
    temperedsanguine: 'sanH',
    timeflux: 'tmfx',
    torntendons: 'tt',
    transfixation: 'trfx',
    vertigo: 'vert',
    vitrification: 'vitri',
    voidfist: 'void',
    voyria: 'voy',
    waterdisrupt: 'wdsr',
    weariness: 'wea',
    webbed: 'web',
    wristfractures: 'wf'
};

const colorPercentage = (perc) => {
        return perc > 75 ? 'green' : (perc >= 33 ? 'yellow' : 'red');
    };

let setPromptVitals = function(vitals) {
    let vars = nexSys.prompt.vars;
    vars.h = vitals.h;
    vars.m = vitals.m;
    vars.e = vitals.e;
    vars.w = vitals.w;
    vars.xp = vitals.xp;
    vars.rage = vitals.rage > 0 ? vitals.rage : "";
    vars.maxh = vitals.maxh;
    vars.maxm = vitals.maxm;
    vars.maxe = vitals.maxe;
    vars.maxw = vitals.maxw;
    vars.bleed = vitals.bleed;
    vars.rage = vitals.rage;

    let perch = vitals.h*100/vitals.maxh;
    let percm = vitals.m*100/vitals.maxm;
    let perce = vitals.e*100/vitals.maxe;
    let percw = vitals.w*100/vitals.maxw;

    vars.hcolor = nexSys.prompt.colorPercentage(perch);
    vars.mcolor = nexSys.prompt.colorPercentage(percm);
    vars.ecolor = nexSys.prompt.colorPercentage(perce);
    vars.wcolor = nexSys.prompt.colorPercentage(percw);

    vars.ph = perch.toFixed(1)+"%";
    vars.pm = percm.toFixed(1)+"%";
    vars.pe = perce.toFixed(1)+"%";
    vars.pw = percw.toFixed(1)+"%";
};

let setPromptAffs = function() {
    let promptAffs = [];
    let affs = nexSys.prompt.vars.affs;
    let affAbbrev = nexSys.prompt.affAbbrev;

    for(let aff in affs) {
        if(affs[aff]) {
            if(affs[aff] === true) {
                promptAffs.push(affAbbrev.hasOwnProperty(aff) ? affAbbrev[aff] : aff);
            }
            else {
                promptAffs.push((affAbbrev.hasOwnProperty(aff) ? affAbbrev[aff] : aff) + "\(" + affs[aff] + "\)");
            }
        }
    }

    nexSys.prompt.vars.affString = promptAffs.length > 0 ?  "["+promptAffs.join(" ")+"]" : "";
};

let gotPromptAff = function(aff) {
    let name = aff.name;
    let affs = nexSys.prompt.vars.affs;
    affs[aff.name] = aff.count || true;

    setPromptAffs();
};

let lostPromptAff = function(aff) {
    let name = aff.name;
    let affs = nexSys.prompt.vars.affs;
    affs[aff.name] = false;

    setPromptAffs();
};

let setPromptDefs = function(args) {
    nexSys.prompt.vars.c = nexSys.Defs.cloak.have ? "c" : "";
    nexSys.prompt.vars.k = nexSys.Defs.kola.have ? "k" : "";
    nexSys.prompt.vars.d = nexSys.Affs.deafness.have ? "" : "d";
    nexSys.prompt.vars.b = nexSys.Affs.blindness.have ? "" : "b";
};

let setPromptBals = function(args) {
    nexSys.prompt.vars.eq = nexSys.Bals.balance.have ? "x" : "";
    nexSys.prompt.vars.bal = nexSys.Bals.equilibrium.have ? "e" : "";
};

let setHealthDiffPrompt = function(args) {
    nexSys.prompt.vars.diffh = args.diff < 0 ? "("+args.diff+")h" : "(+"+args.diff+")h";
    nexSys.prompt.vars.diffhcolor = args.diff < 0 ? "red" : "green";
};

let setManaDiffPrompt = function(args) {
    nexSys.prompt.vars.diffm = args.diff < 0 ? "("+args.diff+")m" : "(+"+args.diff+")m";
    nexSys.prompt.vars.diffmcolor = args.diff < 0 ? "red" : "green";
};


nexSys.eventStream.registerEvent('AffGot', gotPromptAff);
nexSys.eventStream.registerEvent('AffLost', lostPromptAff);
nexSys.eventStream.registerEvent('SystemLoaded', setPromptDefs);
nexSys.eventStream.registerEvent('DefGot', setPromptDefs);
nexSys.eventStream.registerEvent('DefLost', setPromptDefs);
nexSys.eventStream.registerEvent('SystemLoaded', setPromptBals);
nexSys.eventStream.registerEvent('BalanceGot', setPromptBals);
nexSys.eventStream.registerEvent('BalanceLost', setPromptBals);
nexSys.eventStream.registerEvent('SystemCharVitalsUpdated', setPromptVitals);
nexSys.eventStream.registerEvent('HealthUpdated', setHealthDiffPrompt);
nexSys.eventStream.registerEvent('ManaUpdated', setManaDiffPrompt);
nexSys.eventStream.registerEvent('SystemPaused',  function(args) { nexSys.prompt.vars.paused = "(p)"; });
nexSys.eventStream.registerEvent('SystemUnpaused',  function(args) { nexSys.prompt.vars.paused = ""; });
nexSys.eventStream.registerEvent('aeonLostAffEvent', function(args) { nexSys.prompt.vars.aeon = ""; });
nexSys.eventStream.registerEvent('aeonGotAffEvent', function(args) { nexSys.prompt.vars.aeon = "(a)"; });
nexSys.eventStream.registerEvent('SystemSlowModeOn', function(args) { nexSys.prompt.vars.retard = "(r)"; });
nexSys.eventStream.registerEvent('SystemSlowModeOff', function(args) { nexSys.prompt.vars.retard = ""; });