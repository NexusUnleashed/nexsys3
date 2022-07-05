/* global GMCP */
import { eventStream } from './eventStream.js'

if (typeof window.GMCP === 'undefined') {
    window.GMCP = {}
}
export function gmcpHandler() {
    while (eventStream.gmcpBackLog && eventStream.gmcpBackLog.length > 0) {
        const current_args = eventStream.gmcpBackLog.shift()
        if (current_args.gmcp_method) {
            Object.setAtString(
                window.GMCP,
                current_args.gmcp_method.split('.'),
                current_args.gmcp_args
            )
            eventStream.raiseEvent(
                current_args.gmcp_method,
                current_args.gmcp_args
            )
        }
    }
}

export let curRoom = 0
export let curRoomName = ''
export let curArea = ''
export let curRoomArea = ''
GMCP.Items = {
    room: [],
    inv: [],
}

const roomChangeCheck = function (args) {
    if (curRoom !== args.num) {
        curRoom = args.num
        curRoomName = args.name
        curArea = args.area
        curRoomArea = args.name + ' (' + args.area + ')'
        eventStream.raiseEvent('RoomChangedEvent', args)
    }
}
eventStream.registerEvent('Room.Info', roomChangeCheck)

const addedItem = function (args) {
    if (args.location === 'room') {
        window.GMCP.Items.room.push(args.item)
        eventStream.raiseEvent('ItemAddedToRoom', args.item)
    } else if (args.location === 'inv') {
        window.GMCP.Items.inv.push(args.item)
        eventStream.raiseEvent('ItemAddedToInv', args.item)
    }
}

eventStream.registerEvent('Char.Items.Add', addedItem)

const removedItem = function (args) {
    if (args.location === 'room') {
        window.GMCP.Items.room.splice(
            window.GMCP.Items.room.findIndex((e) => e.id === args.item.id),
            1
        )
        eventStream.raiseEvent('ItemRemovedFromRoom', args.item)
    } else if (args.location === 'inv') {
        window.GMCP.Items.inv.splice(
            GMCP.Items.inv.findIndex((e) => e.id === args.item.id),
            1
        )
        eventStream.raiseEvent('ItemRemovedFromInv', args.item)
    }
}

eventStream.registerEvent('Char.Items.Remove', removedItem)

const updatedItem = function (args) {
    if (args.location === 'room') {
        window.GMCP.Items.room[
            window.GMCP.Room.items.findIndex((e) => e.id === args.item.id)
        ] = args.item
        eventStream.raiseEvent('ItemUpdatedRoom', args.item)
    } else if (args.location === 'inv') {
        window.GMCP.Items.inv[
            window.GMCP.Items.inv.findIndex((e) => e.id === args.item.id)
        ] = args.item
        eventStream.raiseEvent('ItemUpdatedInv', args.item)
    }
}

eventStream.registerEvent('Char.Items.Update', updatedItem)

const listItems = function (args) {
    if (args.location === 'room') {
        window.GMCP.Items.room = args.items
        eventStream.raiseEvent('ItemListForRoom', args.items)
    } else if (args.location === 'inv') {
        window.GMCP.Items.inv = args.items
        eventStream.raiseEvent('ItemListForInv', args.items)
    }
}

eventStream.registerEvent('Char.Items.List', listItems)
