import nexsys from "./nexsys";
import "./events/affs";
import "./events/balances";
import "./events/cache";
import "./events/defs";
import "./events/echos";
import "./events/gmcp";
import "./events/lust";
import "./events/serverside";
import "./events/system";
import "./events/prompt";
import "./functions/helpers";
import './functions/clientoverrides';
// Two stage importing for nexsys because we decoupled the eventStream
// package from nexsys to be stand alone. Nexsys needs to be loaded in
// THEN events loaded.

window.nexsys = nexsys;