const talismans = {
    wonders: {
        baitbucket: {
            name: "a banrcle-cruest bucket",
            brief: "This special bucket will automatically generate bait every Achaean day.",
            buckethandle: {count: 0, redeem: 10, complete: 15},
            bucketleft: {count: 0, redeem: 10, complete: 15},
            bucketright: {count: 0, redeem: 10, complete: 15},
            bucketwater: {count: 0, redeem: 10, complete: 15}
        },
        dragonskinpack: {},
        paltinumwhistle: {},
        ramshorn: {},
        monocle: {},
        globe: {},
    },
    miscellaneous: {},
    historical: {},
    conclave: {},
    marks: {},
    seafaring: {},
    death: {},
    blackwave: {},
    races: {},
    cities: {},
    monks: {},
    elemental: {},
    yggdrasil: {},
    contenders: {},
    underworld: {},
    renegades: {},
    invasion: {},
    war: {},
    planes: {},
    eldergods: {},
}

const t2 = [
    {
        id: 'wonders',
        name: 'Wonders',
        description: 'A set of Talismans from old Shop of Wonders items.',
        talismans: [
            {
                id: "baitbucket",
                name: "a barncle-crusted bucket",
                description: "This special bucket will automatically generate bait every Achaean day.",
                value: 100,
                redeem: 67,
                pieces: [
                    {
                        id: "buckethandle",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "bucketleft",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "bucketright",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "bucketwater",
                        count: 0,
                        redeem: 10
                    },
                ]
            },
            {
                id: "dragonskinpack",
                name: "a Dragonskin pack",
                description: "This special backpack is both lidded and will never decay. It also holds more items than a normal backpack.",
                value: 100,
                redeem: 67,
                pieces: [
                    {
                        id: "packscales",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "packstraps",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "packthread",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "packleather",
                        count: 0,
                        redeem: 10
                    },
                ]
            },
        ]

    },
    {
        id: 'historical',
        name: 'Historical',
        description: 'A set of Talismans from Achaean history.',
        talismans: [
            {
                id: "window",
                name: "a Golden Window",
                description: "When you OPEN WINDOW a scene from Achaea's history will be projected into the room.",
                value: 100,
                redeem: 67,
                pieces: [
                    {
                        id: "windowframe",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "windowpane",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "windowjamb",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "windowshutters",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "windowgrid",
                        count: 0,
                        redeem: 10
                    },
                ]
            },
            {
                id: "mantle",
                name: "a Mantle of Himalia",
                description: "The owner can PLACE MANTLE ON FIGUREHEAD while standing in the room with the mounted figurehead. It will use up the mantle and will make the figurehead non-decay and resetting.",
                value: 100,
                redeem: 67,
                pieces: [
                    {
                        id: "mantlecloth",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "mantlethread",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "mantlecentrepiece",
                        count: 0,
                        redeem: 10
                    },
                    {
                        id: "mantlegems",
                        count: 0,
                        redeem: 10
                    },
                ]
            },
        ]

    }
];