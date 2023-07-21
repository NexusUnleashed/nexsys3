const balances = {
  herb: {
    length: 1.6,
    aff_modifiers: {
      homunculusmercury: {
        multiplier: 1.0,
        offset: 0.5,
      } /* earthdisrupt: {multiplier: 1.0, offset: .5} */,
    }, // CUSTOM
  },
  focus: {
    length: 2.5,
    aff_modifiers: {
      weakenedmind: { multiplier: 2.0, offset: 0.5 },
      whisperingmadness: { multiplier: 1.6, offset: 0.0 },
    },
  },
  sip: {
    length: 4.5,
    aff_modifiers: { skullfractures: { multiplier: 1.0, offset: 1.0 } },
  },
  moss: {
    length: 6.0,
  },

  tree: {
    length: 15.0,
    aff_modifiers: { slimeobscure: { multiplier: 1.0, offset: 10.0 } },
  },

  equilibrium: {
    length: 20.0,
    aff_modifiers: { confusion: { multiplier: 1.5, offset: 0.0 } },
  },
  balance: {
    length: 20.0,
    aff_modifiers: { lethargy: { multiplier: 1.25, offset: 0.0 } },
  },
  salve: {
    length: 1.0,
    aff_modifiers: { timeflux: { multiplier: 1.5, offset: 0.0 } },
  },
  immunity: {
    length: 10.0,
  },
  rebounding: {
    length: 9.0,
  },
  smoke: {
    length: 1.5,
  },
  dragonbreath: {
    length: 1.5,
  },
  deafness: {
    length: 3.0,
  },
  deaf: {
    length: 6.0,
  },
  blind: {
    length: 6.0,
  },
  speed: {
    length: 6.0,
  },
  wake: {
    length: 20,
  },
  sileris: {
    length: 8,
  },
  free: {
    length: 0,
  },
  voice: {
    length: 2.5,
  },
  tremolo: {
    length: 6.0,
  },
  homunculus: {
    length: 12.0, // CUSTOM Alchemist
  },
  fitness: {
    length: 10.0,
  },
  bloodboil: {
    length: 10.0,
  },
  dragonheal: {
    length: 20.0,
  },
  rage: {
    length: 10.0,
  },
  salt: {
    length: 10.0,
  },
  shrugging: {
    length: 12.0,
  },
  slough: {
    length: 10.0,
  },
  fool: {
    length: 40.0,
  },
  writhe: {
    length: 6.0,
  },
  impalewrithe: {
    length: 4.0,
  },
  entity: {
    length: 4.0, // CUSTOM Occultist
  },
  word: {
    length: 5.0, // CUSTOM Depthswalker
  },
  karma: {
    length: 5.0, // CUSTOM Unnamable
  },
};

export { balances as balanceTable };
