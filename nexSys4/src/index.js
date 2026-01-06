import { createNexSys4 } from "./facade/createNexSys4";

const nexSys4 = createNexSys4();

if (typeof globalThis !== "undefined") {
  globalThis.nexSys4 = nexSys4;
}

nexSys4.start();

export default nexSys4;
