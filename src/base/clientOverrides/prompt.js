/* global nexSys */

const generate_chunk = (text, fg = "", bg = "") => {
  let result = document.createElement("span");
  result.style.color = fg;
  result.style.backgroundColor = bg;
  result.textContent = text;

  return result;
};

const add = (txt, fg, bg) => {
  if (txt.length === 0) {
    return;
  }

  let vars = nexSys.prompt.vars;

  if (txt === "affString") {
    nexSys.prompt.promptLine.appendChild(vars.affString);
    return;
  }

  if (vars.hasOwnProperty(txt)) {
    nexSys.prompt.promptLine.appendChild(
      generate_chunk(vars[txt].text, vars[txt].fg, vars[txt].bg)
    );
  } else {
    nexSys.prompt.promptLine.appendChild(generate_chunk(txt, fg, bg));
  }
};

const addHTML = (html) => {
  const res = document.createElement("span");
  res.innerHTML = html;
  nexSys.prompt.promptLine.appendChild(res);
};

const colorPercentage = (perc) => {
  return perc > 75 ? "green" : perc >= 33 ? "yellow" : "red";
};

const colorGradation = (perc) => {
  return `hsl(${perc * 1.2}, 100%, ${
    perc < 75 ? 50 : Math.abs(perc - 100) / 2 + 25
  }%)`;
};

const getCustomPrompt = () => {
  let vars = nexSys.prompt.vars;
  const add = nexSys.prompt.add;
  nexSys.prompt.promptLine = document.createElement("span");

  if (vars.blackout) {
    add("-", "reset", "");
    return promptLine.outerHTML;
  }

  add("paused");
  add("aeon");
  add("retard");
  if (nexSys.defs.prismatic.have) {
    add("[[", vars.prismatic.fg, vars.prismatic.bg);
  }
  if (nexSys.defs.shield.have) {
    add("((", vars.shield.fg, vars.shield.bg);
  }
  add("h");
  add("(" + vars.ph.text + "), ", vars.h.fg, vars.h.bg);
  add("m");
  add("(" + vars.pm.text + ") ", vars.m.fg, vars.m.bg);
  if (nexSys.sys.isClass("Occultist")) {
    add(`${nexSys.sys.char.karma}K `, vars.karma.fg, vars.karma.bg);
  }
  if (vars.rage.text > 0) {
    add(`${vars.rage.text}R `, vars.rage.fg, vars.rage.bg);
  }
  add("eq");
  add("bal");
  add("|");
  add("c");
  add("k");
  add("d");
  add("b");
  if (nexSys.defs.shield.have) {
    add("))", vars.shield.fg, vars.shield.bg);
  }
  if (nexSys.defs.prismatic.have) {
    add("]]", vars.prismatic.fg, vars.prismatic.bg);
  }
  add(" ");
  add("affString");
  add("diffh");
  add("diffm");

  vars.diffh.text = "";
  vars.diffm.text = "";
  return nexSys.prompt.promptLine.outerHTML;
};

const addAffArray = function (affs) {
  let affLine = document.createElement("span");
  affLine.className = "mono";

  if (!Array.isArray(affs) || affs.length === 0) {
    nexSys.prompt.promptLine.appendChild(affLine);
    return affLine;
  }

  // TODO: This sorts affs based on priority order for prompt display.
  // How to make this also sort based on order within priority?
  // Do we care?
  affs.sort((a, b) => {
    let res;
    if (nexSys.affTable.prios[a] > nexSys.affTable.prios[b]) {
      res = 1;
    } else if (nexSys.affTable.prios[a] < nexSys.affTable.prios[b]) {
      res = -1;
    } else {
      const prioArray =
        nexSys.affTable.prioArrays[nexSys.affTable.prios[a]] || [];
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

  let affAbbrev = nexSys.prompt.affAbbrev;

  let add = (txt, fg, bg) => {
    affLine.appendChild(generate_chunk(txt, fg, bg));
  };

  add("[", "brown");
  for (let i = 0; i < affs.length; i++) {
    const aff = affs[i];
    const fg = affAbbrev[aff] ? affAbbrev[aff].fg : "";
    const bg = affAbbrev[aff] ? affAbbrev[aff].bg : "";
    let txt = affAbbrev[aff] ? affAbbrev[aff].text : aff;

    //const count = promptAffs[aff] === true ? "" : `(${promptAffs[aff]})`;
    add(`${txt}${affs.length > 1 && i < affs.length - 1 ? " " : ""}`, fg, bg);
  }
  add("]", "brown");

  nexSys.prompt.promptLine.appendChild(affLine);
  return affLine;
};

export const prompt = {
  promptLine: {},
  generate_chunk: generate_chunk,
  add: add,
  addHTML: addHTML,
  colorPercentage: colorPercentage,
  colorGradation: colorGradation,
  getCustomPrompt: getCustomPrompt,
  addAffArray: addAffArray,
};

prompt.vars = {
  blackout: false,
  paused: { text: "", fg: "red", bg: "" },
  retard: { text: "", fg: "blue", bg: "" },
  aeon: { text: "", fg: "red", bg: "" },

  h: { text: "0", fg: "green", bg: "" },
  m: { text: "0", fg: "green", bg: "" },
  e: { text: "0", fg: "green", bg: "" },
  w: { text: "0", fg: "green", bg: "" },
  xp: { text: "", fg: "", bg: "" },
  maxh: { text: "", fg: "", bg: "" },
  maxm: { text: "", fg: "", bg: "" },
  maxe: { text: "", fg: "", bg: "" },
  maxw: { text: "", fg: "", bg: "" },
  ph: { text: "100%", fg: "green", bg: "" },
  pm: { text: "100%", fg: "green", bg: "" },
  pe: { text: "100%", fg: "", bg: "" },
  pw: { text: "100%", fg: "", bg: "" },
  diffh: { text: "", fg: "green", bg: "" },
  diffm: { text: "", fg: "green", bg: "" },
  diffhp: { text: "", fg: "green", bg: "" },
  diffmp: { text: "", fg: "green", bg: "" },
  diffxp: { text: "", fg: "", bg: "" },
  target: { text: "", fg: "red", bg: "" },
  targetHP: { text: "", fg: "green", bg: "" },

  eq: { text: "", fg: "", bg: "" },
  bal: { text: "", fg: "", bg: "" },
  c: { text: "", fg: "", bg: "" },
  k: { text: "", fg: "", bg: "" },
  d: { text: "", fg: "", bg: "" },
  b: { text: "", fg: "", bg: "" },

  affs: {},
  affString: document.createElement("span"),

  bleed: { text: "", fg: "", bg: "" },
  rage: { text: "", fg: "red", bg: "" },

  age: { text: "", fg: "red", bg: "" },
  essence: { text: "", fg: "", bg: "" },
  kai: { text: "", fg: "", bg: "" },
  karma: { text: "", fg: "green", bg: "" },
  vitality: { text: "", fg: "purple", bg: "" },
  kaitrance: { text: "", fg: "blue", bg: "" },
  shintrance: { text: "", fg: "", bg: "" },
  stance: { text: "", fg: "white", bg: "" },
};

prompt.cureColors = {
  antimony: { fg: "olive", bg: "" }, // eat
  argentum: { fg: "royalblue", bg: "" }, // eat
  arsenic: { fg: "", bg: "" }, // eat
  aurum: { fg: "ForestGreen", bg: "" }, // eat
  azurite: { fg: "", bg: "" }, // eat
  bisemutum: { fg: "", bg: "" },
  calamine: { fg: "", bg: "" }, // eat
  calcite: { fg: "slategray", bg: "" }, // eat
  cinnabar: { fg: "greenyellow", bg: "" }, // smoke
  cuprum: { fg: "DeepSkyBlue", bg: "" }, // eat
  ferrum: { fg: "DarkOrange", bg: "" }, // eat
  gypsum: { fg: "", bg: "" },
  magnesium: { fg: "Red", bg: "" }, // eat
  plumbum: { fg: "Gold", bg: "" }, // eat
  potash: { fg: "", bg: "" },
  quartz: { fg: "", bg: "" },
  quicksilver: { fg: "", bg: "" },
  realgar: { fg: "firebrick", bg: "" }, // smoke
  stannum: { fg: "Tan", bg: "" }, // eat
  caloric: { fg: "darkseagreen", bg: "" }, // apply
  mending: { fg: "orchid", bg: "" }, // apply
  epidermal: { fg: "sienna", bg: "" }, // apply
  restoration: { fg: "darkviolet", bg: "" }, // apply
  health: { fg: "lightpink", bg: "" }, // sip
  writhe: { fg: "PaleGoldenRod", bg: "darkslategray" },
};

prompt.affAbbrev = {
  addiction: { text: "add", ...prompt.cureColors.ferrum },
  aeon: { text: "ae", ...prompt.cureColors.cinnabar },
  agoraphobia: { text: "agor", ...prompt.cureColors.argentum },
  amnesia: { text: "amn", fg: "", bg: "" },
  anorexia: { text: "ANO", ...prompt.cureColors.epidermal },
  asthma: { text: "AST", ...prompt.cureColors.aurum },
  blackout: { text: "bo", fg: "", bg: "" },
  blindness: { text: "unb", ...prompt.cureColors.arsenic },
  bound: { text: "bnd", ...prompt.cureColors.writhe },
  brokenleftarm: { text: "la1", ...prompt.cureColors.mending },
  brokenleftleg: { text: "ll1", ...prompt.cureColors.mending },
  brokenrightarm: { text: "ra1", ...prompt.cureColors.mending },
  brokenrightleg: { text: "rl1", ...prompt.cureColors.mending },
  bruisedribs: { text: "ribs", fg: "", bg: "" },
  burning: { text: "burn", ...prompt.cureColors.mending },
  calcifiedskull: { text: "calh", ...prompt.cureColors.restoration },
  calcifiedtorso: { text: "calt", ...prompt.cureColors.restoration },
  claustrophobia: { text: "clau", ...prompt.cureColors.stannum },
  clumsiness: { text: "clu", ...prompt.cureColors.aurum },
  concussion: { text: "conc", ...prompt.cureColors.restoration },
  confusion: { text: "con", ...prompt.cureColors.stannum },
  corruption: { text: "corr", fg: "", bg: "" },
  crackedribs: { text: "cr", ...prompt.cureColors.health },
  crushedthroat: { text: "cru", ...prompt.cureColors.mending },
  daeggerimpale: { text: "daeg", ...prompt.cureColors.writhe },
  damage: { text: "dmg", fg: "tomato", bg: "" },
  damagedleftarm: { text: "la2", ...prompt.cureColors.restoration },
  damagedleftleg: { text: "ll2", ...prompt.cureColors.restoration },
  damagedrightarm: { text: "ra2", ...prompt.cureColors.restoration },
  damagedrightleg: { text: "rl2", ...prompt.cureColors.restoration },
  damagedhead: { text: "hd2", ...prompt.cureColors.restoration },
  darkshade: { text: "dark", ...prompt.cureColors.ferrum },
  dazed: { text: "dzd", ...prompt.cureColors.cinnabar },
  dazzled: { text: "dzl", ...prompt.cureColors.mending },
  deadening: { text: "dea", ...prompt.cureColors.cinnabar },
  deafness: { text: "und", ...prompt.cureColors.calamine },
  dehydrated: { text: "deh", fg: "", bg: "" },
  dementia: { text: "dem", ...prompt.cureColors.stannum },
  depression: { text: "dep", ...prompt.cureColors.plumbum },
  deteriorate: { text: "det", fg: "", bg: "" },
  disloyalty: { text: "disl", ...prompt.cureColors.realgar },
  disrupted: { text: "disr", fg: "", bg: "" },
  dissonance: { text: "disso", ...prompt.cureColors.plumbum },
  dizziness: { text: "diz", ...prompt.cureColors.plumbum },
  enscorcelled: { text: "ensor", fg: "", bg: "" },
  entangled: { text: "entgl", ...prompt.cureColors.writhe },
  epilepsy: { text: "epi", ...prompt.cureColors.plumbum },
  fear: { text: "fear", fg: "", bg: "" },
  flushings: { text: "flush", ...prompt.cureColors.ferrum },
  frozen: { text: "frz", ...prompt.cureColors.caloric },
  generosity: { text: "gen", ...prompt.cureColors.cuprum },
  grievouswounds: { text: "grv", ...prompt.cureColors.health },
  guilt: { text: "gui", ...prompt.cureColors.argentum },
  haemophilia: { text: "haem", ...prompt.cureColors.ferrum },
  hallucinations: { text: "hall", ...prompt.cureColors.stannum },
  hamstrung: { text: "hms", fg: "", bg: "" },
  healthleech: { text: "hthl", ...prompt.cureColors.aurum },
  heartseed: { text: "heart", ...prompt.cureColors.restoration },
  hellsight: { text: "hell", ...prompt.cureColors.realgar },
  horror: { text: "hor", ...prompt.cureColors.plumbum },
  hypersomnia: { text: "hypers", ...prompt.cureColors.stannum },
  hypochondria: { text: "hypoch", ...prompt.cureColors.aurum },
  hypothermia: { text: "hypoth", ...prompt.cureColors.restoration },
  icefisted: { text: "ice", fg: "", bg: "" },
  impaled: { text: "impl", ...prompt.cureColors.writhe },
  impatience: { text: "IMPAT", ...prompt.cureColors.plumbum },
  indifference: { text: "ind", ...prompt.cureColors.cuprum },
  itching: { text: "itch", ...prompt.cureColors.epidermal },
  justice: { text: "just", ...prompt.cureColors.cuprum },
  kkractlebrand: { text: "kkr", ...prompt.cureColors.health },
  laceratedthroat: { text: "lac2", ...prompt.cureColors.restoration },
  latched: { text: "latch", ...prompt.cureColors.health },
  lethargy: { text: "let", ...prompt.cureColors.ferrum },
  lightbind: { text: "light", fg: "", bg: "" },
  loneliness: { text: "lon", ...prompt.cureColors.argentum },
  lovers: { text: "love", ...prompt.cureColors.cuprum },
  manaleech: { text: "man", ...prompt.cureColors.realgar },
  mangledleftarm: { text: "la3", ...prompt.cureColors.restoration },
  mangledleftleg: { text: "ll3", ...prompt.cureColors.restoration },
  mangledrightarm: { text: "ra3", ...prompt.cureColors.restoration },
  mangledrightleg: { text: "rl3", ...prompt.cureColors.restoration },
  mangledhead: { text: "hd3", ...prompt.cureColors.restoration },
  masochism: { text: "maso", ...prompt.cureColors.argentum },
  mildtrauma: { text: "tor1", ...prompt.cureColors.restoration },
  mycalium: { text: "myc", ...prompt.cureColors.plumbum },
  nausea: { text: "nau", ...prompt.cureColors.ferrum },
  numbedleftarm: { text: "nbla", fg: "", bg: "" },
  numbedrightarm: { text: "nbra", fg: "", bg: "" },
  pacified: { text: "pac", ...prompt.cureColors.cuprum },
  paralysis: { text: "PAR", ...prompt.cureColors.magnesium },
  paranoia: { text: "prn", ...prompt.cureColors.stannum },
  parasite: { text: "prs", ...prompt.cureColors.aurum },
  peace: { text: "pea", ...prompt.cureColors.cuprum },
  phlogisticated: { text: "phlog", fg: "", bg: "" },
  pinshot: { text: "psh", fg: "", bg: "" },
  pressure: { text: "pres", ...prompt.cureColors.calcite },
  prone: { text: "pr", fg: "", bg: "" },
  pyramides: { text: "pyra", ...prompt.cureColors.magnesium },
  pyre: { text: "pyre", ...prompt.cureColors.cuprum },
  rebbies: { text: "reb", ...prompt.cureColors.aurum },
  recklessness: { text: "reck", ...prompt.cureColors.argentum },
  retardation: { text: "ret", fg: "", bg: "" },
  retribution: { text: "retr", ...prompt.cureColors.cuprum },
  revealed: { text: "rev", fg: "", bg: "" },
  sandfever: { text: "sand", ...prompt.cureColors.plumbum },
  scalded: { text: "scald", ...prompt.cureColors.epidermal },
  scytherus: { text: "scy", ...prompt.cureColors.ferrum },
  selarnia: { text: "sel", ...prompt.cureColors.mending },
  sensitivity: { text: "sen", ...prompt.cureColors.aurum },
  serioustrauma: { text: "tor2", ...prompt.cureColors.restoration },
  shadowmadness: { text: "shad", ...prompt.cureColors.plumbum },
  shivering: { text: "shiv", ...prompt.cureColors.caloric },
  shyness: { text: "shy", ...prompt.cureColors.plumbum },
  skullfractures: { text: "sf", ...prompt.cureColors.health },
  slashedthroat: { text: "lac1", ...prompt.cureColors.epidermal },
  sleeping: { text: "slp", fg: "", bg: "" },
  slickness: { text: "SLI", ...prompt.cureColors.magnesium },
  slimeobscure: { text: "nkh", fg: "", bg: "" },
  spiritburn: { text: "spirB", ...prompt.cureColors.argentum },
  spiritwrack: { text: "spirW", fg: "", bg: "" },
  stupidity: { text: "st", ...prompt.cureColors.plumbum },
  stuttering: { text: "stut", ...prompt.cureColors.epidermal },
  homunculusmercury: { text: "merc", fg: "", bg: "" },
  temperedcholeric: { text: "choH", ...prompt.cureColors.antimony },
  temperedmelancholic: { text: "melaH", ...prompt.cureColors.antimony },
  temperedphlegmatic: { text: "phleH", ...prompt.cureColors.antimony },
  temperedsanguine: { text: "sanH", ...prompt.cureColors.antimony },
  tenderskin: { text: "tend", ...prompt.cureColors.argentum },
  tension: { text: "tens", ...prompt.cureColors.cinnabar },
  timeflux: { text: "tmfx", fg: "", bg: "" },
  timeloop: { text: "tmlp", ...prompt.cureColors.cuprum },
  tonguetied: { text: "tngt", ...prompt.cureColors.restoration },
  torntendons: { text: "tt", ...prompt.cureColors.health },
  transfixation: { text: "trfx", ...prompt.cureColors.writhe },
  unweavingbody: { text: "unwM", ...prompt.cureColors.ferrum },
  unweavingspirit: { text: "unwS", ...prompt.cureColors.cinnabar },
  unweavingmind: { text: "unwM", ...prompt.cureColors.plumbum },
  vertigo: { text: "vert", ...prompt.cureColors.argentum },
  vitrified: { text: "vitri", fg: "", bg: "" },
  voidfisted: { text: "void", fg: "", bg: "" },
  voyria: { text: "voy", fg: "", bg: "" },
  weariness: { text: "wea", ...prompt.cureColors.aurum },
  webbed: { text: "web", ...prompt.cureColors.writhe },
  whisperingmadness: { text: "mad", ...prompt.cureColors.argentum },
  wristfractures: { text: "wf", ...prompt.cureColors.health },
};

// Affs missing from prompt list:
// nexSys.affTable.list.filter(aff => Object.keys(nexSys.prompt.affAbbrev).indexOf(aff) === -1).sort()
