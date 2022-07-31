/*global */

import { cacheTable } from '../tables/cacheTable'
import { Cache } from '../classes/Cache'

export const Caches = {}

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

    Caches[herb] = new Cache(herb, amount, obj)
}
