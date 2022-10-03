import nexsys from "./nexsys";
import "./base/affs/affEvents";
import "./base/balances/balanceEvents";
import "./base/cache/cacheEvents";
import "./base/defs/defEvents";
import "./base/echo/echoEvents";
import "./base/system/gmcp";
import "./base/utilities/lust";
import "./base/serverside/serversideEvents";
import "./base/system/sysEvents";
import "./base/clientOverrides/prompt";
import "./base/utilities/helpers";
import './base/clientOverrides/clientoverrides';
// Two stage importing for nexsys because we decoupled the eventStream
// package from nexsys to be stand alone. Nexsys needs to be loaded in
// THEN events loaded.

window.nexsys = nexsys;