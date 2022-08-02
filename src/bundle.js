/* global nexusclient */
import nexSys from "./nexsys";
import "./events/affs";
import "./events/balances";
import "./events/cache";
import "./events/defs";
import "./events/echos";
import "./events/gmcp";
import "./events/lust";
import "./events/serverside";
import "./events/system";
import "./functions/helpers";
import './functions/clientoverrides';

window.nexSys = nexSys;
nexusclient.datahandler().send_GMCP("IRE.Rift.Request");
nexSys.applyClientOverrides();
nexSys.loadCustomSettings();
nexusclient.reflexes().run_function("CustomSettingsFromPackage", {}, "ALL");
