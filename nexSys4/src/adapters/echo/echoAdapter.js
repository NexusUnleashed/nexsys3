const buildNotice = (displayNotice, client) => {
  if (typeof displayNotice === "function") {
    return displayNotice;
  }
  if (client?.display_notice) {
    return (...args) => client.display_notice(...args);
  }
  return (...args) => {
    const text = args.filter((_, idx) => idx % 3 === 0).join(" ");
    console.log(text);
  };
};

const normalizeName = (payload) => {
  if (!payload) {
    return "";
  }
  if (typeof payload === "string") {
    return payload;
  }
  return payload.name ?? payload.id ?? "";
};

export const createEchoAdapter = ({
  core,
  eventStream,
  displayNotice,
  nexusclient,
}) => {
  const evt = eventStream || globalThis.eventStream;
  const client = nexusclient || globalThis.nexusclient;
  const handlers = [];
  const notice = buildNotice(displayNotice, client);

  const on = (name, fn) => {
    if (!evt?.registerEvent) {
      return;
    }
    const id = `nexSys4:echo:${name}`;
    evt.registerEvent(name, fn, { id });
    handlers.push({ name, id });
  };

  const offAll = () => {
    if (!evt?.removeListener) {
      return;
    }
    handlers.forEach((handler) => evt.removeListener(handler.name, handler.id));
    handlers.length = 0;
  };

  const echoPrefix = (prefix, prefixFg, prefixBg, text, fg, bg) => {
    if (!text) {
      return;
    }
    notice(prefix, prefixFg, prefixBg, text, fg, bg);
  };

  const getSettings = () => core.getState().system.settings || {};

  const gotTrackable = (data) => {
    if (getSettings().echoTrackableGot) {
      echoPrefix(" + ", "white", "", normalizeName(data), "green", "");
    }
  };

  const lostTrackable = (data) => {
    if (getSettings().echoTrackableLost) {
      echoPrefix(" - ", "white", "", normalizeName(data), "red", "");
    }
  };

  const gotAff = (data) => {
    if (getSettings().echoAffGot) {
      echoPrefix(" +aff ", "orange", "", normalizeName(data), "green", "");
    }
  };

  const lostAff = (data) => {
    if (getSettings().echoAffLost) {
      echoPrefix(" -aff ", "orange", "", normalizeName(data), "red", "");
    }
  };

  const gotDef = (data) => {
    if (getSettings().echoDefGot) {
      echoPrefix(" +def ", "purple", "", normalizeName(data), "green", "");
    }
  };

  const lostDef = (data) => {
    if (getSettings().echoDefLost) {
      echoPrefix(" -def ", "purple", "", normalizeName(data), "red", "");
    }
  };

  const gotBalance = (data) => {
    if (!getSettings().echoBalanceGot) {
      return;
    }
    const name = normalizeName(data);
    if (!name || name === "SystemOutput") {
      return;
    }
    const duration = data?.duration;
    const label =
      typeof duration === "number" && Number.isFinite(duration)
        ? `${name}(${duration.toFixed(2)})`
        : name;
    echoPrefix(" onBal ", "brown", "", label, "green", "");
  };

  const lostBalance = (data) => {
    if (getSettings().echoBalanceLost) {
      echoPrefix(" offBal ", "brown", "", normalizeName(data), "red", "");
    }
  };

  const prioritySet = (data) => {
    if (!getSettings().echoPrioritySet) {
      return;
    }
    const name = normalizeName(data);
    if (!name || data?.prio == null) {
      return;
    }
    echoPrefix(
      "priority change: ",
      "yellow",
      "",
      `${name} ${data.prio}`,
      "red",
      ""
    );
  };

  const outputSent = (output) => {
    if (!getSettings().echoOutput) {
      return;
    }
    const list = Array.isArray(output) ? output : [String(output)];
    notice(`(${list.join("|")})`, "red", "");
  };

  const start = () => {
    on("TrackableGot", gotTrackable);
    on("TrackableLost", lostTrackable);
    on("AffGot", gotAff);
    on("AffLost", lostAff);
    on("DefGot", gotDef);
    on("DefLost", lostDef);
    on("BalanceGot", gotBalance);
    on("BalanceLost", lostBalance);
    on("PrioritySetEvent", prioritySet);
    on("OutputSentEvent", outputSent);
  };

  const stop = () => {
    offAll();
  };

  return { start, stop };
};
