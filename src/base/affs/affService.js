import { affs } from "./affs"

export function getCurrentAffs() {

  return Object.keys(affs)
      .filter((aff) => affs[aff].have === true)
      .sort((a, b) => {
          return affs[a].prio - affs[b].prio
      })
}

export function haveAff(aff) {
  const curAff = affs[aff]
  if (aff === undefined || curAff === undefined) {
      /* nexSys.sysLog(
          'Called nexSys.haveAff with an aff that does not exist: ' + aff
      )*/
      return false
  } else {
      return curAff.have
  }
}

export function haveAffs(affs) {
  if (affs === undefined) {
      return false
  }

  if (Array.isArray(affs)) {
      for (let i = 0; i < affs.length; i++) {
          if (!haveAff(affs[i])) {
              return false
          }
      }
      return true
  } else {
      return haveAff(affs)
  }
}

export function haveAnAff(affs) {
  if (affs === undefined) {
      return false
  }

  if (Array.isArray(affs)) {
      for (let i = 0; i < affs.length; i++) {
          if (haveAff(affs[i])) {
              return true
          }
      }
      return false
  } else {
      return haveAff(affs)
  }
}

export function affPrioSwap(aff, prio) {
  const curAff = affs[aff]
  if (aff === undefined || curAff === undefined) {
      /* nexSys.sysLog(
          'Called nexSys.affPrioSwap with an aff that does not exist: ' + aff
      )*/
  } else {
      curAff.set_prio(prio)
  }
}