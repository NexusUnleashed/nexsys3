/* global nexSys */
let mySysSettings = {
  sep: "|",
  customPrompt: true,
  echoAffGot: true,
  echoAffLost: true,
  echoDefGot: true,
  echoDefLost: true,
  echoBalanceGot: true,
  echoBalanceLost: true,
  echoTrackableGot: true,
  echoTrackableLost: true,
  echoPrioritySet: true,

  curingMethod: "Transmutation",
  sipHealthAt: 80,
  sipManaAt: 80,
  mossHealthAt: 80,
  mossManaAt: 80,
  focus: true,
  focusOverHerbs: true,
  tree: true,
  clot: true,
  clotAt: 5,
  insomnia: true,
  fracturesAbove: 30,
  manaAbilitiesAbove: 1,
  batch: true,
};

nexSys.updateAndSaveModel(
  "CustomSystemSettings",
  nexSys.sys.settings,
  mySysSettings
);

/*
Need to add priority for these
    'crushedthroat', 
    'dazzled', 
    'depression', 
    'grievouswounds', 
    'indifference', 
    'retribution', 
    'shadowmadness',
*/
let myAffPrios = {
  //serverside affs 1-26, 26=ignore
  aeon: 2,
  concussion: 2,
  anorexia: 2,
  sleeping: 2,

  heartseed: 3,
  paralysis: 3,
  guilt: 3,
  skullfractures: 3,

  hypothermia: 4,
  impatience: 4,
  torntendons: 4,

  pyramides: 5,
  mycalium: 5,
  flushings: 5,
  rebbies: 5,
  parasite: 5,
  sandfever: 5,
  hypochondria: 5,
  lovers: 5,
  itching: 5,
  pacified: 5,
  peace: 5,
  scytherus: 5,
  fratricide: 5,

  asthma: 6,
  bound: 6,
  daeggerimpale: 6,
  clumsiness: 6,
  entangled: 6,
  impaled: 6,
  sensitivity: 6,
  transfixation: 6,
  weariness: 6,
  webbed: 6,

  damagedleftleg: 7,
  damagedrightleg: 7,
  darkshade: 7,
  mangledleftleg: 7,
  mangledrightleg: 7,

  brokenleftleg: 8,
  brokenrightleg: 8,
  confusion: 8,
  hallucinations: 8,
  hypersomnia: 8,

  disrupted: 9,
  mangledhead: 9,
  prone: 9,
  stupidity: 9,
  voyria: 9,

  airdisrupt: 10,
  brokenleftarm: 10,
  brokenrightarm: 10,
  slickness: 10,
  waterdisrupt: 10,
  wristfractures: 10,

  indifference: 11,
  retribution: 11,
  shadowmadness: 11,
  addiction: 11,
  crackedribs: 11,
  haemophilia: 11,
  lethargy: 11,
  nausea: 11,
  whisperingmadness: 11,

  damagedhead: 12,
  hellsight: 12,
  recklessness: 12,

  damagedleftarm: 13,
  damagedrightarm: 13,
  healthleech: 13,
  manaleech: 13,
  temperedcholeric: 13,
  temperedmelancholic: 13,
  temperedphlegmatic: 13,
  temperedsanguine: 13,

  disloyalty: 14,
  dissonance: 14,
  dizziness: 14,
  mangledleftarm: 14,
  mangledrightarm: 14,
  shyness: 14,

  agoraphobia: 15,
  claustrophobia: 15,
  deadening: 15,
  frozen: 15,
  generosity: 15,
  justice: 15,
  loneliness: 15,
  shivering: 15,
  vertigo: 15,

  dementia: 16,
  mildtrauma: 16,
  paranoia: 16,
  serioustrauma: 16,

  epilepsy: 17,

  burning: 18,
  laceratedthroat: 18,
  slashedthroat: 18,
  stuttering: 18,

  selarnia: 19,

  fear: 20,
  masochism: 20,
  scalded: 20,
  dazed: 20,

  //affs you can cure on your own, but no serverside, 30-49, 30=ignore
  bleeding: 30,
  amnesia: 30,
  blackout: 30,

  //def affs
  insomnia: 10,
  insulation: 20,
  deafness: 21,
  blindness: 22,

  // unknowns, 100=ignore
  harmonic: 100,
  bop: 100,
  spiritwrack: 100,
  bedevil: 100,
  loki: 100,
  moon: 100,
  evileye: 100,
  dragoncurse: 100,
  swiftcurse: 100,
};

nexSys.updateModel(nexSys.affTable.prios, myAffPrios);
nexSys.saveModel("CustomAffSettings", nexSys.affTable);

let myDefKeepupPrios = {
  // Normal defences
  alertness: 0,
  curseward: 0,
  density: 0,
  groundwatch: 0,
  heldbreath: 0,
  hypersight: 0,
  lifevision: 0,
  metawake: 0,
  mindseye: 0,
  reflections: 0,
  shield: 0,
  softfocusing: 0,
  telesense: 0,
  treewatch: 0,
  vigilance: 0,
  insomnia: 10,
  deathsight: 10,
  speed: 15,
  insulation: 20,
  kola: 21,
  deafness: 21,
  blindness: 22,
  temperance: 23,
  cloak: 0,
  airpocket: 0,
  fangbarrier: 25,
  levitating: 25,
  nightsight: 25,
  coldresist: 0,
  electricresist: 0,
  fireresist: 0,
  magicresist: 0,
  poisonresist: 0,
  rebounding: 0,
  skywatch: 0,
  selfishness: 25,
  thirdeye: 25,

  // class defences

  // Dragon
  dragonarmour: 0,
  dragonbreath: 24,

  // Air Lord
  skysight: 0,
  tempest: 0,

  // Occultist
  arctar: 0,
  devilmark: 0,
  distortedaura: 0,
  tentacles: 0,

  // non-serverside defences 50=ignore
  blocking: 0,
  locketdeath: 0,
  meditate: 0,
  mounted: 0,
  prismatic: 0,
  "parrying left leg": 0,
  "parrying right arm": 0,
  "parrying left arm": 0,
  "parrying head": 0,
  "parrying torso": 0,
  "parrying left": 0,
  "parrying right": 0,
  "parrying centre": 0,
  "parrying right leg": 0,
};
console.log(myDefKeepupPrios);
let myDefStaticPrios = {
  // Regular
  mindseye: 10,
  cloak: 24,

  // Dragon
  dragonarmour: 24,

  // Fire Lord
  fireshroud: 25,

  // Occultist
  devilmark: 24,
  shroud: 24,
  lifevision: 20,
};

nexSys.updateModel(nexSys.defPrios.keepup, myDefKeepupPrios);
nexSys.updateModel(nexSys.defPrios.static, myDefStaticPrios);
nexSys.saveModel("CustomDefSettings", nexSys.defPrios);

let myCacheSettings = {
  magnesium: 2,
  plumbum: 1,
  arsenic: 2,
  potash: 2,
  stannum: 1,
  malachite: 1,
  realgar: 1,
  cinnabar: 1,
  antimony: 2,
  ferrum: 1,
  quartz: 1,
  quicksilver: 1,
  aurum: 2,
  calamine: 1,
  cuprum: 1,
  argentum: 1,
  gypsum: 0,

  //herbs
  ginseng: 0,
  bloodroot: 0,
  kelp: 0,
  hawthorn: 0,
  lobelia: 0,
  bellwort: 0,
  ginger: 0,
  bayberry: 0,
  ash: 0,
  goldenseal: 0,
  moss: 0,
  valerian: 0,
  elm: 0,
  skullcap: 0,
  sileris: 0,
  kola: 0,
  cohosh: 0,
};
nexSys.updateAndSaveModel(
  "CustomCacheSettings",
  nexSys.cacheTable,
  myCacheSettings
);

nexSys.whiteList = [
  "Imyrr",
  "Makenna",
  "Grandue",
  "Theosis",
  "Kierra",
  "Nyar",
  "Senzu",
  "Dalran",
  "Dunn",
  "Mizik",
  "Irimon",
  "Paine",
];
nexSys.saveModel("LustWhiteList", nexSys.whiteList);
