/*global */

import { cacheTable } from './cacheTable'
import { Cache } from './Cache'

export const caches = {}

const cache = cacheTable
for (const herb in cache) {
    const amount = cache[herb]
    const obj = {}
    obj.blocks = [
        'death',
        'sleeping',
        ['brokenleftarm', 'brokenrightarm'],
        ['brokenleftarm', 'damagedrightarm'],
        ['brokenleftarm', 'mangledrightarm'],
        ['damagedleftarm', 'brokenrightarm'],
        ['damagedleftarm', 'damagedrightarm'],
        ['damagedleftarm', 'mangledrightarm'],
        ['mangledleftarm', 'brokenrightarm'],
        ['mangledleftarm', 'damagedrightarm'],
        ['mangledleftarm', 'mangledrightarm'],
        'entangled',
        'transfixation',
        'impaled',
        'webbed',
        'bound',
        'blackout',
    ]

    caches[herb] = new Cache(herb, amount, obj)
}
