export const serversideSettings = {
  loaded: false,
  status: {},
  affs: {},
  defs: {},
};

export const setCuringStatusVars = function () {
  for (const status in serversideSettings.status) {
    const curStatus = serversideSettings.status[status];
    const systemStatus = sys.state[status];
    if (curStatus !== systemStatus) {
      sys.setSystemStatus(status, systemStatus);
    }
  }
};