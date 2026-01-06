import { chunkCommands } from "./chunking";
import { planDefOutputs } from "./defPlanner";
import { planCacheOutputs } from "./cachePlanner";

export const createOutputPlanner = (config) => {
  const planServerside = (state, serverside) => {
    const commands = serverside?.commands?.length ? [...serverside.commands] : [];
    if (!commands.length) {
      return { raw: [], commands: [] };
    }
    const sep = state.system.settings.sep || config.commandSeparator;
    const chunks = chunkCommands(commands, sep, config.outputChunkSize);
    return { raw: commands, commands: chunks };
  };

  const planPrecache = (state) => {
    const commands = planCacheOutputs(state);
    if (!commands.length) {
      return { raw: [], commands: [], planId: 0 };
    }
    const ack = `echo SystemEvent ${config.precacheAckEvent}`;
    const raw = commands.concat(ack);
    const sep = state.system.settings.sep || config.commandSeparator;
    const chunks = chunkCommands(raw, sep, config.outputChunkSize);
    return { raw, commands: chunks, planId: state.runtime.precachePlanId + 1 };
  };

  const planNexSys = (state) => {
    const commands = [];
    const defOutputs = planDefOutputs(state);
    if (defOutputs.length) {
      commands.push(...defOutputs);
    }
    if (state.runtime.pendingNexsysCommands.length) {
      commands.push(...state.runtime.pendingNexsysCommands);
    }
    if (!commands.length) {
      return { raw: [], commands: [], planId: 0 };
    }
    const ack = `echo SystemEvent ${config.nexsysAckEvent}`;
    const raw = commands.concat(ack);
    const sep = state.system.settings.sep || config.commandSeparator;
    const chunks = chunkCommands(raw, sep, config.outputChunkSize);
    return { raw, commands: chunks, planId: state.runtime.nexsysPlanId + 1 };
  };

  return { planServerside, planPrecache, planNexSys };
};
