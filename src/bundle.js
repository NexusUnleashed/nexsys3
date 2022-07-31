/* global nexusclient */
import nexSys from './nexsys';

window.nexSys = nexSys;
nexSys.applyClientOverrides();
nexSys.generateEchos();
nexSys.serversideEvents();
nexSys.loadCustomSettings();
nexusclient.reflexes().run_function('CustomSettingsFromPackage', {}, 'ALL');