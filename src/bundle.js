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

window.nexSys = nexSys;
nexSys.applyClientOverrides();
nexSys.loadCustomSettings();
nexusclient.reflexes().run_function("CustomSettingsFromPackage", {}, "ALL");