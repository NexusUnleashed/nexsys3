import { affs } from "../affs/affs"
import { cures as Cures } from "./cures"

export function getCureOutputs(affList, balList) {
  let cureOutputs = []
  let affCurable = true

  while (affCurable) {
      affCurable = false
      for (let i = 0; i < affList.length && !affCurable; i++) {
          const aff = affs[affList[i]]
          const cures = aff.cures
          for (let j = 0; j < cures.length; j++) {
              let canPerform = true
              const cure = Cures[cures[j]]
              if (
                  !cure.isIgnored &&
                  !Array.arraysIntersect(cure.blocks, affList)
              ) {
                  // isn't blocked by an aff

                  for (
                      let k = 0;
                      k < cure.balsReq.length && canPerform;
                      k++
                  ) {
                      if (balList.indexOf(cure.balsReq[k]) === -1) {
                          canPerform = false
                      }
                  }

                  // can Perform it, now make sure it can only cure this aff
                  if (canPerform) {
                      for (
                          let k = 0;
                          k < cure.order.length && canPerform;
                          k++
                      ) {
                          if (
                              cure.order[k] !== aff.name &&
                              affList.indexOf(cure.order[k]) >= 0
                          ) {
                              canPerform = false
                          }
                      }

                      if (canPerform) {
                          // We found a for sure cure, so restart loop with updated affList and balList
                          cureOutputs = cureOutputs.concat(cure.command)
                          affCurable = true
                          affList.splice(affList.indexOf(aff.name), 1)
                          if (
                              cure.balsUsed.length !== 0 &&
                              cure.balsUsed[0] !== 'free'
                          ) {
                              for (let k = 0; k < cure.balsUsed.length; k++) {
                                  balList.splice(
                                      balList.indexOf(cure.balsUsed[k]),
                                      1
                                  )
                              }
                          }
                      }
                  }
              }
          }
      }
  } // end while loop, no more for-sure cures were found

  // Now loop and finds cures that are possible but not guaranteed
  affCurable = true
  while (affCurable) {
      affCurable = false
      for (let i = 0; i < affList.length && !affCurable; i++) {
          const aff = affs[affList[i]]
          const cures = aff.cures
          for (let j = 0; j < cures.length; j++) {
              let canPerform = true
              const cure = Cures[cures[j]]
              if (
                  !cure.isIgnored &&
                  !Array.arraysIntersect(cure.blocks, affList)
              ) {
                  // isn't blocked by an aff

                  for (
                      let k = 0;
                      k < cure.balsReq.length && canPerform;
                      k++
                  ) {
                      if (balList.indexOf(cure.balsReq[k]) === -1) {
                          canPerform = false
                      }
                  }

                  // can Perform it, no need to make sure it might cure something else
                  if (canPerform) {
                      // We found a possible cure, so restart loop with updated affList and balList
                      cureOutputs = cureOutputs.concat(cure.command)
                      affCurable = true
                      affList.splice(affList.indexOf(aff.name), 1)
                      if (cure.balsUsed[0] !== 'free') {
                          for (let k = 0; k < cure.balsUsed.length; k++) {
                              balList.splice(
                                  balList.indexOf(cure.balsUsed[k]),
                                  1
                              )
                          }
                      }
                  }
              }
          }
      }
  } // end while loop, no more possible cures were found

  return cureOutputs
}