import { cacheTable, herb_name_to_herb } from '../tables/cacheTable'
import { Cache } from '../base/cache'
import { Affs } from './affs'
import { Defs } from './defs'
import { eventStream } from '../base/eventStream.js'

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

export function getMissingCache() {
    const caches = Caches
    const current_cache = []
    for (const cache in caches) {
        if (caches[cache].needToOutr) {
            current_cache.push(caches[cache])
        }
    }

    return current_cache
}

export function getCacheOutputs(affList) {
    if (Affs.blindness.have || Defs.mindseye.have) {
        const missingCache = getMissingCache() // return this as sorted by prio
        let cacheOutputs = []

        for (let i = 0; i < missingCache.length; i++) {
            const cache = missingCache[i]

            if (!Array.arraysIntersect(cache.blocks, affList)) {
                cacheOutputs = cacheOutputs.concat(cache.command)
            }
        }

        return cacheOutputs
    } else {
        return []
    }
}

const filterHerbAndAmount = function (herb) {
    if (herb.location === 'inv') {
        if (herb.item !== undefined && herb.item.icon === 'curative') {
            let herbShort = ''
            let amount = 1
            if (herb.item.name.startsWith('a group of')) {
                const regexp = /(\d+)\s+(.+)/i
                const matches = herb.item.name.match(regexp)
                herbShort = herb_name_to_herb[matches[2]]
                amount = parseInt(matches[1])
            } else {
                herbShort = herb_name_to_herb[herb.item.name]
                amount = 1
            }

            if (herbShort !== undefined) {
                return { name: herbShort, amount: amount }
            }
        }
    }
    return false
}

const eventGmcpInvAdd = function (herb) {
    const herbAmt = filterHerbAndAmount(herb)
    if (herbAmt) {
        eventStream.raiseEvent(
            herbAmt.name + 'CacheCountAddEvent',
            herbAmt.amount
        )
    }
}

eventStream.registerEvent('Char.Items.Add', eventGmcpInvAdd)

const eventGmcpInvRemove = function (herb) {
    const herbAmt = filterHerbAndAmount(herb)
    if (herbAmt) {
        eventStream.raiseEvent(
            herbAmt.name + 'CacheCountSubtractEvent',
            herbAmt.amount
        )
    }
}

eventStream.registerEvent('Char.Items.Remove', eventGmcpInvRemove)

const eventGmcpIreRiftChange = function (args) {
    const herb = args.name
    const amount = parseInt(args.amount)

    eventStream.raiseEvent(herb + 'RiftSetEvent', amount)
}

eventStream.registerEvent('IRE.Rift.Change', eventGmcpIreRiftChange)

const eventGmcpIreRiftList = function (args) {
    for (let i = 0; i < args.length; i++) {
        eventStream.raiseEvent(args[i].name + 'RiftSetEvent', args[i].amount)
    }

    eventStream.raiseEvent('RiftListCompleteEvent')
}

eventStream.registerEvent('IRE.Rift.List', eventGmcpIreRiftList)
