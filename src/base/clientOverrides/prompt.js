/* global nexSys */

const generate_chunk = (text, fg = "", bg = "") => {
  let result = document.createElement("span");
  result.style.color = fg;
  result.style.backgroundColor = bg;
  result.innerHTML = text;

  return result;
};

const colorPercentage = (perc) => {
  return perc > 75 ? "green" : perc >= 33 ? "yellow" : "red";
};

const getCustomPrompt = () => {
  let vars = nexSys.prompt.vars;
  let promptLine = document.createElement("span");

  let add = (txt, fg, bg) => {
    if (txt.length === 0) {
      return;
    }
    promptLine.appendChild(nexSys.prompt.generate_chunk(txt, fg, bg));
  };

  if (vars.blackout) {
    add("-", "reset", "");
    return promptLine.outerHTML;
  }

  add(vars.paused.text, vars.paused.fg, vars.paused.bg);
  add(vars.aeon.text, vars.aeon.fg, vars.aeon.bg);
  add(vars.retard.text, vars.retard.fg, vars.retard.bg);
  if (nexSys.defs.prismatic.have) {
    add("[[", vars.prismatic.fg, vars.prismatic.bg);
  }
  if (nexSys.defs.shield.have) {
    add("((", vars.shield.fg, vars.shield.bg);
  }
  add(vars.h.text, vars.h.fg, vars.h.bg);
  add("(" + vars.ph.text + "), ", vars.h.fg, vars.h.bg);
  add(vars.m.text, vars.m.fg, vars.m.bg);
  add("(" + vars.pm.text + ") ", vars.m.fg, vars.m.bg);
  if (nexSys.sys.isClass("Occultist")) {
    add(`${nexSys.sys.char.karma}K `, vars.karma.fg, vars.karma.bg);
  }
  if (vars.rage.text > 0) {
    add(`${vars.rage.text}R `, vars.rage.fg, vars.rage.bg);
  }
  add(vars.eq.text + vars.bal.text + "|", vars.eq.fg, vars.eq.bg);
  add(
    `${vars.c.text}${vars.k.text}${vars.d.text}${vars.b.text}`,
    vars.c.fg,
    vars.c.bg
  );
  if (nexSys.defs.shield.have) {
    add("))", vars.shield.fg, vars.shield.bg);
  }
  if (nexSys.defs.prismatic.have) {
    add("]]", vars.prismatic.fg, vars.prismatic.bg);
  }
  add(" ", "", "");
  promptLine.appendChild(vars.affString);
  add(vars.diffh.text, vars.diffh.fg, vars.diffh.bg);
  add(vars.diffm.text, vars.diffm.fg, vars.diffm.bg);

  vars.diffh.text = "";
  vars.diffm.text = "";
  return promptLine.outerHTML;
};

export const prompt = {
  generate_chunk: generate_chunk,
  colorPercentage: colorPercentage,
  getCustomPrompt: getCustomPrompt,
};

prompt.vars = {
  blackout: false,
  h: { text: "0", fg: "green", bg: "" },
  m: { text: "0", fg: "green", bg: "" },
  e: { text: "0", fg: "green", bg: "" },
  w: { text: "0", fg: "green", bg: "" },
  xp: { text: "", fg: "", bg: "" },
  rage: { text: "", fg: "green", bg: "" },
  maxh: { text: "", fg: "", bg: "" },
  maxm: { text: "", fg: "", bg: "" },
  maxe: { text: "", fg: "", bg: "" },
  maxw: { text: "", fg: "", bg: "" },
  bleed: { text: "", fg: "", bg: "" },
  ph: { text: "100%", fg: "", bg: "" },
  pm: { text: "100%", fg: "", bg: "" },
  pe: { text: "100%", fg: "", bg: "" },
  pw: { text: "100%", fg: "", bg: "" },
  diffh: { text: "", fg: "green", bg: "" },
  diffm: { text: "", fg: "green", bg: "" },
  diffxp: { text: "", fg: "", bg: "" },
  target: { text: "", fg: "red", bg: "" },
  eq: { text: "", fg: "", bg: "" },
  bal: { text: "", fg: "", bg: "" },
  c: { text: "", fg: "", bg: "" },
  k: { text: "", fg: "", bg: "" },
  d: { text: "", fg: "", bg: "" },
  b: { text: "", fg: "", bg: "" },
  affs: {},
  affString: document.createElement("span"),
  paused: { text: "", fg: "red", bg: "" },
  retard: { text: "", fg: "blue", bg: "" },
  aeon: { text: "", fg: "red", bg: "" },
  kai: { text: "", fg: "", bg: "" },
  karma: { text: "", fg: "green", bg: "" },
  vitality: { text: "", fg: "purple", bg: "" },
  kaitrance: { text: "", fg: "blue", bg: "" },
  shintrance: { text: "", fg: "", bg: "" },
  stance: { text: "", fg: "white", bg: "" },
  shield: { text: "", fg: "cyan", bg: "" },
  prismatic: { text: "", fg: "yellow", bg: "" },
};

prompt.cureColors = {
  antimony: {fg: "", bg: ""},
  argentum: {fg: "LightSeaGreen", bg: ""},
  arsenic: {fg: "", bg: ""},
  aurum: {fg: "ForestGreen", bg: ""},
  azurite: {fg: "", bg: ""},
  calamine: {fg: "", bg: ""},
  calcite: {fg: "", bg: ""},
  cinnabar: {fg: "", bg: ""},
  cuprum: {fg: "DeepSkyBlue", bg: ""},
  ferrum: {fg: "Orange", bg: ""},
  gypsum: {fg: "", bg: ""},
  magnesium: {fg: "Red", bg: ""},
  plumbum: {fg: "Gold", bg: ""},
  quartz: {fg: "", bg: ""},
  quicksilver: {fg: "", bg: ""},
  realgar: {fg: "", bg: ""},
  stannum: {fg: "Tan", bg: ""},
  caloric: {fg: "", bg: ""},
  mending: {fg: "", bg: ""},
  epidermal: {fg: "", bg: ""},
  restoration: {fg: "", bg: ""},
  health: {fg: "", bg: ""},
}

prompt.affAbbrev = {
  addiction: { text: "add", fg: "", bg: "" },
  aeon: { text: "ae", fg: "", bg: "" },
  agoraphobia: { text: "agor", fg: "", bg: "" },
  amnesia: { text: "amn", fg: "", bg: "" },
  anorexia: { text: "ANO", fg: "", bg: "" },
  asleep: { text: "asl", fg: "", bg: "" },
  asthma: { text: "AST", fg: prompt.cureColors.aurum.fg, bg: prompt.cureColors.aurum.fg },
  blackout: { text: "bo", fg: "", bg: "" },
  blindness: { text: "unb", fg: "", bg: "" },
  bound: { text: "bnd", fg: "", bg: "" },
  brokenleftarm: { text: "la1", fg: "", bg: "" },
  brokenleftleg: { text: "ll1", fg: "", bg: "" },
  brokenrightarm: { text: "ra1", fg: "", bg: "" },
  brokenrightleg: { text: "rl1", fg: "", bg: "" },
  bruisedribs: { text: "ribs", fg: "", bg: "" },
  burning: { text: "burn", fg: "", bg: "" },
  charredburn: { text: "4burn", fg: "", bg: "" },
  claustrophobia: { text: "clau", fg: "", bg: "" },
  clumsiness: { text: "cl", fg: "", bg: "" },
  confusion: { text: "con", fg: "", bg: "" },
  corruption: { text: "corr", fg: "", bg: "" },
  crackedribs: { text: "cr", fg: "", bg: "" },
  damagedleftarm: { text: "la2", fg: "", bg: "" },
  damagedleftleg: { text: "ll2", fg: "", bg: "" },
  damagedrightarm: { text: "ra2", fg: "", bg: "" },
  damagedrightleg: { text: "rl2", fg: "", bg: "" },
  damagedhead: { text: "hd2", fg: "", bg: "" },
  darkshade: { text: "dark", fg: "", bg: "" },
  dazed: { text: "dzd", fg: "", bg: "" },
  deadening: { text: "dea", fg: "", bg: "" },
  deafness: { text: "und", fg: "", bg: "" },
  dehydrated: { text: "deh", fg: "", bg: "" },
  dementia: { text: "dem", fg: "", bg: "" },
  disloyalty: { text: "disl", fg: "", bg: "" },
  disrupted: { text: "disr", fg: "", bg: "" },
  dissonance: { text: "disso", fg: "", bg: "" },
  dizziness: { text: "diz", fg: "", bg: "" },
  entangled: { text: "entgl", fg: "", bg: "" },
  epilepsy: { text: "epi", fg: "", bg: "" },
  extremeburn: { text: "3burn", fg: "", bg: "" },
  fear: { text: "fear", fg: "", bg: "" },
  frozen: { text: "frz", fg: "", bg: "" },
  generosity: { text: "gen", fg: "", bg: "" },
  haemophilia: { text: "haem", fg: "", bg: "" },
  hallucinations: { text: "hall", fg: "", bg: "" },
  hamstrung: { text: "hms", fg: "", bg: "" },
  healthleech: { text: "hthl", fg: "", bg: "" },
  heartseed: { text: "heart", fg: "", bg: "" },
  hellsight: { text: "hell", fg: "", bg: "" },
  hypersomnia: { text: "hypers", fg: "", bg: "" },
  hypochondria: { text: "hypoch", fg: "", bg: "" },
  hypothermia: { text: "hypoth", fg: "", bg: "" },
  icefist: { text: "ice", fg: "", bg: "" },
  impaled: { text: "impl", fg: "", bg: "" },
  impatience: { text: "IMPAT", fg: prompt.cureColors.plumbum.fg, bg: prompt.cureColors.plumbum.fg },
  itching: { text: "itch", fg: "", bg: "" },
  justice: { text: "just", fg: "", bg: "" },
  laceratedthroat: { text: "lac2", fg: "", bg: "" },
  lethargy: { text: "let", fg: "", bg: "" },
  loneliness: { text: "lon", fg: "", bg: "" },
  lovers: { text: "love", fg: "", bg: "" },
  /*insulation: {text: 'cal',*/
  whisperingmadness: { text: "mad", fg: "", bg: "" },
  mangledleftarm: { text: "la3", fg: "", bg: "" },
  mangledleftleg: { text: "ll3", fg: "", bg: "" },
  mangledrightarm: { text: "ra3", fg: "", bg: "" },
  mangledrightleg: { text: "rl3", fg: "", bg: "" },
  mangledhead: { text: "hd3", fg: "", bg: "" },
  masochism: { text: "maso", fg: "", bg: "" },
  meltingburn: { text: "5burn", fg: "", bg: "" },
  mildtrauma: { text: "tor1", fg: "", bg: "" },
  nausea: { text: "nau", fg: prompt.cureColors.ferrum.fg, bg: prompt.cureColors.ferrum.fg },
  slimeobscure: { text: "nkh", fg: "", bg: "" },
  numbedleftarm: { text: "nbla", fg: "", bg: "" },
  numbedrightarm: { text: "nbra", fg: "", bg: "" },
  pacified: { text: "pac", fg: "", bg: "" },
  paralysis: { text: "PAR", fg: prompt.cureColors.magnesium.fg, bg: prompt.cureColors.magnesium.fg },
  paranoia: { text: "prn", fg: "", bg: "" },
  peace: { text: "pea", fg: "", bg: "" },
  phlogistication: { text: "phlog", fg: "", bg: "" },
  pinshot: { text: "psh", fg: "", bg: "" },
  prone: { text: "pr", fg: "", bg: "" },
  recklessness: { text: "reck", fg: "", bg: "" },
  retardation: { text: "ret", fg: "", bg: "" },
  roped: { text: "rop", fg: "", bg: "" },
  sanguinehumour: { text: "sanH", fg: "", bg: "" },
  scalded: { text: "scald", fg: "", bg: "" },
  scytherus: { text: "scy", fg: "", bg: "" },
  selarnia: { text: "sel", fg: "", bg: "" },
  sensitivity: { text: "sen", fg: "", bg: "" },
  serioustrauma: { text: "tor2", fg: "", bg: "" },
  severeburn: { text: "2burn", fg: "", bg: "" },
  shivering: { text: "shiv", fg: "", bg: "" },
  shyness: { text: "shy", fg: "", bg: "" },
  skullfractures: { text: "sf", fg: "", bg: "" },
  slashedthroat: { text: "lac1", fg: "", bg: "" },
  sleeping: { text: "slp", fg: "", bg: "" },
  slickness: { text: "SLI", fg: "", bg: "" },
  //spiritdisrupt: {text: 'sdsr', // CUSTOM
  stain: { text: "sta", fg: "", bg: "" },
  stupidity: { text: "st", fg: "", bg: "" },
  stuttering: { text: "stut", fg: "", bg: "" },
  homunculusmercury: { text: "merc", fg: "", bg: "" },
  temperedcholeric: { text: "choH", fg: "", bg: "" },
  temperedmelancholic: { text: "melaH", fg: "", bg: "" },
  temperedphlegmatic: { text: "phleH", fg: "", bg: "" },
  temperedsanguine: { text: "sanH", fg: "", bg: "" },
  timeflux: { text: "tmfx", fg: "", bg: "" },
  torntendons: { text: "tt", fg: "", bg: "" },
  transfixation: { text: "trfx", fg: "", bg: "" },
  vertigo: { text: "vert", fg: "", bg: "" },
  vitrification: { text: "vitri", fg: "", bg: "" },
  voidfist: { text: "void", fg: "", bg: "" },
  voyria: { text: "voy", fg: "", bg: "" },
  weariness: { text: "wea", fg: "", bg: "" },
  webbed: { text: "web", fg: "", bg: "" },
  wristfractures: { text: "wf", fg: "", bg: "" },
};
