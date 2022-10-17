/* global eventStream, nexsys */

let isClass = nexsys.sys.isClass;
let checkOnPrompt = false;

let aeonSwapGot = function() {
    let affs = nexsys.affs;
    nexsys.sendInline([
        "curing siphealth 30",
        "curing sipmana 10",
        "curing mosshealth 0",
        "curing mossmana 0",
        "curing batch off",
        "curing clotat 5000"]);
    affs.asthma.set_prio(3);
    affs.weariness.set_prio(4);
    affs.anorexia.set_prio(5);
    affs.impatience.set_prio(7);
    affs.paralysis.set_prio(8);
};

let aeonSwapLost = function() {
    let affs = nexsys.affs;
    let settings = nexsys.sys.state;
    nexsys.sendInline([
        "curing siphealth "+settings.sipHealthAt,
        "curing sipmana "+settings.sipManaAt,
        "curing mosshealth "+settings.mossHealthAt,
        "curing mossmana "+settings.mossManaAt,
        "curing batch on",
        "curing clotat "+settings.clotAt]);
    affs.asthma.reset_prio();
    affs.weariness.reset_prio();
    affs.anorexia.reset_prio();
    affs.impatience.reset_prio();
    affs.paralysis.reset_prio();
};
// CUSTOM
//eventStream.registerEvent('AffGot', aeonSwapGot);
//eventStream.registerEvent('AffLost', aeonSwapLost);
eventStream.registerEvent('aeonGotAffEvent', aeonSwapGot);
eventStream.registerEvent('aeonLostAffEvent', aeonSwapLost);

let checkFocusSwapLost = function() {
    let affs = nexsys.affs;
    affs.stupidity.set_prio(9);
    affs.recklessness.set_prio(12);
    affs.dizziness.set_prio(14);
    affs.shyness.set_prio(14);
};

let checkFocusSwapGot = function() {
    let affs = nexsys.affs;
    affs.stupidity.reset_prio();
    affs.recklessness.reset_prio();
    affs.dizziness.reset_prio();
    affs.shyness.reset_prio();
};

// CUSTOM
//eventStream.registerEvent('BalanceLost', checkFocusSwapLost);
//eventStream.registerEvent('BalanceGot', checkFocusSwapGot);
eventStream.registerEvent('focusLostBalEvent', checkFocusSwapLost);
eventStream.registerEvent('focusGotBalEvent', checkFocusSwapGot);


let checkPrioritySwaps = function(arg) {
    
    if(checkOnPrompt) {
        
        checkOnPrompt = false;
        let affs = nexsys.affs;

        // Scytherus
        if (nexsys.haveAffs(['scytherus', 'paralysis'])) {
            affs.scytherus.set_prio(2);
        }
        else {
            affs.scytherus.reset_prio();
        }

        // Confusion and Disrupt
        if (nexsys.haveAffs(['confusion', 'disrupted']) && (nexsys.haveBal('focus') || nexsys.haveAff('impatience')) && !nexsys.haveAff('whisperingmadness')) {
            affs.confusion.set_prio(2);
        }
        else {
            affs.confusion.reset_prio();
        }

        if (nexsys.haveAff('impatience') && nexsys.snapTrack.have && nexsys.snapTrack.elapsed() < 8000) {
            affs.impatience.set_prio(2);
        }
        else {
            affs.impatience.reset_prio();
        }

        if (nexsys.haveAffs(['impatience', 'hypochondria'])) {
            affs.hypochondria.set_prio(1);
        }
        else if (nexsys.haveAff('hypochondria') && nexsys.snapTrack.have && nexsys.snapTrack.elapsed() < 8000) {
            affs.hypochondria.set_prio(2);
        }
        else {
            affs.hypochondria.reset_prio();
        }

        if (nexsys.haveAffs(['slickness', 'asthma']) && nexsys.haveAnAff(['sensitivity', 'clumsiness', 'weariness', 'hypochondria']) && !affs.anorexia.have) {
            affs.slickness.set_prio(2);
        }
        else {
            affs.slickness.reset_prio();
        }

        if (nexsys.haveAffs(['slickness', 'asthma']) && !nexsys.haveAnAff(['sensitivity', 'clumsiness', 'weariness', 'hypochondria'])) {
            affs.asthma.set_prio(2);
        }
        else if (nexsys.haveAffs(['hellsight', 'asthma'])) {
            affs.asthma.set_prio(2);
        }
        else {
            affs.asthma.reset_prio();
        }

        if (affs.darkshade.have && affs.darkshade.elapsed() > 10000 && nexsys.roomItems['a lightwall']) {
            affs.darkshade.set_prio(2);
        }
        else {
            affs.darkshade.reset_prio();
        }

        if (nexsys.haveAffs(['prone', 'sensitivity']) && nexsys.haveAnAff(['damagedleftleg', 'damagedrightleg'])) {
            affs.sensitivity.set_prio(2);
        }
        else {
            affs.sensitivity.reset_prio();
        }

        if (nexsys.haveAff('conflagration') && nexsys.haveAnAff(['brokenleftleg', 'brokenrightleg', 'damagedleftleg', 'damagedrightleg', 'mangledleftleg', 'mangledrightleg'])) {
            if (nexsys.haveAff('prone') && !nexsys.haveAnAff(['damagedleftleg', 'damagedrightleg', 'mangledleftleg', 'mangledrightleg'])) {
                affs.burning.set_prio(7);
            }
            else {
                affs.burning.set_prio(4);
            }
        }
        else {
            affs.burning.reset_prio();
        }
/* CUSTOM Insulation not an aff
        if (nexsys.haveAff('timeflux')) {
            if (nexsys.haveAff('prone') && !nexsys.haveAnAff(['damagedleftleg', 'damagedrightleg', 'mangledleftleg', 'mangledrightleg'])) {
                affs.insulation.set_prio(7);
            }
            else {
                affs.insulation.set_prio(4);
            }
        }
        else {
            affs.insulation.reset_prio();
        }
*/
        if (affs.cadmuscurse.have) {
            affs.vertigo.set_prio(4);
        }
        else {
            affs.vertigo.reset_prio();
        }

        // add vivi and heartseed curing here
        if (affs.prone.have && (nexsys.haveAnAff(['damagedleftleg', 'damagedrightleg', 'mangledleftleg', 'mangledrightleg']) || nexsys.haveAffs(['brokenrightleg', 'brokenleftleg']))) {
            /*affs.damagedleftleg.set_prio(6);
            affs.damagedrightleg.set_prio(6);
            affs.mangledleftleg.set_prio(6);
            affs.mangledrightleg.set_prio(6); CUSTOM*/
        }
        else {
            /*affs.damagedleftleg.reset_prio();
            affs.damagedrightleg.reset_prio();
            affs.mangledleftleg.reset_prio();
            affs.mangledrightleg.reset_prio(); CUSTOM*/
        }

        // Fitness
        if (isClass(['Runewarden', 'Monk', 'Blademaster', 'Infernal', 'Paladin', 'Sentinel', 'Druid'])) {
            if (nexsys.haveAff('asthma')) {
                if (nexsys.haveAnAff(['slickness', 'hellsight']) && nexsys.haveAnAff(['paralysis', 'clumsiness', 'sensitivity'])) {
                    nexsys.cures.fitness.set_prio(100);
                }
                else if (nexsys.haveAnAff(['damagedhead', 'mangledhead', 'damagedleftleg', 'damagedrightleg']) && nexsys.haveAnAff(['paralysis', 'clumsiness', 'sensitivity', 'slickness', 'hellsight', 'disloyalty'])) {
                    nexsys.cures.fitness.set_prio(100);
                }
                else {
                    nexsys.cures.fitness.reset_prio();
                }
            }
            else {
                nexsys.cures.fitness.reset_prio();
            }
        }
        else {
            nexsys.cures.fitness.reset_prio();
        }

        // Dragon
        if (isClass('Dragon')) {
            // Dragonheal

            if (nexsys.haveAffs(["asthma", "slickness", "anorexia"]) && (!nexsys.haveBal("focus") || nexsys.haveAff("impatience"))) {
                nexsys.cures.dragonheal.set_prio(100);
            }
            else {
                nexsys.cures.dragonheal.reset_prio();
            }

            // Dragonflex

            if (nexsys.haveAffs(["entangled", "webbed"])) {
                nexsys.cures.dragonflex.set_prio(100);
            }
            else if (nexsys.haveAnAff(['entangled', 'webbed'])) {
                if ((nexsys.haveBal("balance") && !nexsys.haveBal("writhe")) || nexsys.haveAff('transfixation')) {
                    nexsys.cures.dragonflex.set_prio(100);
                }
                else {
                    nexsys.cures.dragonflex.reset_prio();
                }
            }
            else {
                nexsys.cures.dragonflex.reset_prio();
            }
        }
        else {
            nexsys.cures.dragonflex.reset_prio();
            nexsys.cures.dragonheal.reset_prio();
        }

        // Magi
        if (isClass('Magi')) {
            // Bloodboil
            if (nexsys.haveAffs(['asthma', 'slickness'])) {
                if (nexsys.haveAnAff(['hypochondria', 'paralysis']) || (nexsys.haveAff('anorexia') && (!nexsys.haveBal("focus") || nexsys.haveAff("impatience")))) {
                    nexsys.cures.bloodboil.set_prio(100);
                }
                else {
                    nexsys.cures.bloodboil.reset_prio();
                }
            }
            else {
                nexsys.cures.bloodboil.reset_prio();
            }
        }
        else {
            nexsys.cures.bloodboil.reset_prio();
        }


        // Bard
        if (isClass('Bard')) {
            // Dwinnu
            if (nexsys.haveAffs(['webbed', 'entangled'])) {
                nexsys.cures.dwinnu.set_prio(100);
            }
            else if (nexsys.haveAnAff(['webbed', 'entangled']) && nexsys.haveAff('transfixation')) {
                nexsys.cures.dwinnu.set_prio(100);
            }
            else {
                nexsys.cures.dwinnu.reset_prio();
            }
        }
        else {
            nexsys.cures.dwinnu.reset_prio();
        }

        // Alchemist
        if (isClass('Alchemist')) {
            // Salt
            if (nexsys.haveAffs(['asthma', 'slickness', 'anorexia']) && (!nexsys.haveBal("focus") || nexsys.haveAff("impatience"))) {
                nexsys.cures.salt.set_prio(100);
            }
            else if (nexsys.haveAffs(['asthma', 'slickness', 'hypochondria']) || nexsys.haveAffs(['asthma', 'slickness', 'paralysis'])) {
                nexsys.cures.salt.set_prio(100);
            }
            else {
                nexsys.cures.salt.reset_prio();
            }
        }
        else {
            nexsys.cures.salt.reset_prio();
        }

        // Serpent
        if (isClass('Serpent')) {
            // Shrugging
            if (nexsys.haveAffs(['asthma', 'slickness', 'anorexia']) && (!nexsys.haveBal("focus") || nexsys.haveAff("impatience"))) {
                nexsys.cures.shrugging.set_prio(100);
            }
            else if (nexsys.haveAffs(['asthma', 'slickness', 'hypochondria']) || nexsys.haveAffs(['asthma', 'slickness', 'paralysis'])) {
                nexsys.cures.shrugging.set_prio(100);
            }
            else {
                nexsys.cures.shrugging.reset_prio();
            }
        }
        else {
            nexsys.cures.shrugging.reset_prio();
        }

        // Occultist
        if (isClass('Occultist')) {
            // Fool
            if (nexsys.haveAffs(['asthma', 'slickness', 'anorexia']) && (!nexsys.haveBal("focus") || nexsys.haveAff("impatience"))) {
                nexsys.cures.fool.set_prio(100);
            }
            else if (nexsys.haveAffs(['asthma', 'slickness', 'hypochondria']) || nexsys.haveAffs(['asthma', 'slickness', 'impatience'])) {
                nexsys.cures.fool.set_prio(100);
            }
            else {
                nexsys.cures.fool.reset_prio();
            }
        }
        else {
            nexsys.cures.fool.reset_prio();
        }

        // Blademaster
        if (isClass('Blademaster')) {
            // Alleviate
            if (nexsys.haveAffs(['asthma', 'slickness', 'anorexia']) && (!nexsys.haveBal("focus") || nexsys.haveAff("impatience"))) {
                nexsys.cures.alleviate.set_prio(100);
            }
            else if (nexsys.haveAffs(['asthma', 'slickness', 'hypochondria']) || nexsys.haveAffs(['asthma', 'slickness', 'impatience'])) {
                nexsys.cures.alleviate.set_prio(100);
            }
            else {
                nexsys.cures.alleviate.reset_prio();
            }
        }
        else {
            nexsys.cures.alleviate.reset_prio();
        }
    }
};

let checkPrioritySwapsOnPrompt = function() {
    checkOnPrompt = true;
};

eventStream.registerEvent('PromptEvent', checkPrioritySwaps);
eventStream.registerEvent('AffGot', checkPrioritySwapsOnPrompt);
eventStream.registerEvent('AffLost', checkPrioritySwapsOnPrompt);
eventStream.registerEvent('BalanceLost', checkPrioritySwapsOnPrompt); 
eventStream.registerEvent('BalanceGot', checkPrioritySwapsOnPrompt);
eventStream.registerEvent('ClassChanged', checkPrioritySwapsOnPrompt);


let cadmusGained = function(aff) {
    if(aff.name === "cadmuscurse") {
        nexsys.sendCmd('curing focus off');
    }
};

let cadmusLost = function(aff) {
    if(aff.name === "cadmuscurse") {
        nexsys.sendCmd('curing focus on');
    }
};
eventStream.registerEvent('cadmusGotAffEvent', cadmusGained);
eventStream.registerEvent('cadmusLostAffEvent', cadmusLost);


let gotSnapped = function(person) {
    if(nexsys.sys.isTarget(person)) {
        eventStream.raiseEvent('SnappedGotTrackableEvent');
    }
};
eventStream.registerEvent('GotSnappedEvent', gotSnapped);