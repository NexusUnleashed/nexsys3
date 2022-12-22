/* global eventStream */

export let curRoom = 0;
export let curRoomName = '';
export let curArea = '';
export let curRoomArea = '';

const roomChangeCheck = function (args) {
    if (curRoom !== args.num) {
        curRoom = args.num;
        curRoomName = args.name;
        curArea = args.area;
        curRoomArea = args.name + ' (' + args.area + ')';
        eventStream.raiseEvent('RoomChangedEvent', args);
    }
};
eventStream.registerEvent('Room.Info', roomChangeCheck);

const addedItem = function (args) {
    if (args.location === 'room') {
        eventStream.raiseEvent('ItemAddedToRoom', args.item);
    } else if (args.location === 'inv') {
        eventStream.raiseEvent('ItemAddedToInv', args.item);
    }
};

eventStream.registerEvent('Char.Items.Add', addedItem);

const removedItem = function (args) {
    if (args.location === 'room') {
        eventStream.raiseEvent('ItemRemovedFromRoom', args.item);
    } else if (args.location === 'inv') {
        eventStream.raiseEvent('ItemRemovedFromInv', args.item);
    }
};

eventStream.registerEvent('Char.Items.Remove', removedItem);

const updatedItem = function (args) {
    if (args.location === 'room') {
        eventStream.raiseEvent('ItemUpdatedRoom', args.item);
    } else if (args.location === 'inv') {
        eventStream.raiseEvent('ItemUpdatedInv', args.item);
    }
};

eventStream.registerEvent('Char.Items.Update', updatedItem);

const listItems = function (args) {
    if (args.location === 'room') {
        eventStream.raiseEvent('ItemListForRoom', args.items);
    } else if (args.location === 'inv') {
        eventStream.raiseEvent('ItemListForInv', args.items);
    }
};

eventStream.registerEvent('Char.Items.List', listItems);
