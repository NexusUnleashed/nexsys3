import { eventStream } from './eventStream.js'
import { sys } from './sys.js'

export class Echo {
    constructor(fg, bg, selector) {
        this._fg = fg || 'white'
        this._bg = bg
        this._selector = selector || '#output_main'
        this.echo = this.echo.bind(this)
    }

    echo(text) {
        window.display_notice(this._selector, text, this._fg, this._bg)
    }
}

export class EchoLine extends Echo {
    echo(text) {
        // text += "\n";
        super.echo(text)
    }
}

export class EchoWithPrefix extends Echo {
    constructor(prefix, fg, bg, selector) {
        super(fg, bg, selector)
        if (prefix !== undefined) {
            this._prefix = prefix.text
            this._prefixFg = prefix.fg
            this._prefixBg = prefix.bg
        }
        this.echo = this.echo.bind(this)
    }

    echo(text) {
        window.display_notice(
            this._selector,
            this._prefix,
            this._prefixFg,
            this._prefixBg,
            text,
            this._fg,
            this._bg
        )
    }
}

export class EchoLinePrefix extends EchoWithPrefix {
    echo(text) {
        // text += "\n";
        super.echo(text)
    }
}

const selector = '#output_main'
const TrackableEchoGot = new EchoLinePrefix(
    { text: ' + ', fg: 'white' },
    'green',
    '',
    selector
)
const TrackableEchoLost = new EchoLinePrefix(
    { text: ' - ', fg: 'white' },
    'red',
    '',
    selector
)
const AffEchoGot = new EchoLinePrefix(
    { text: ' +aff ', fg: 'orange' },
    'green',
    '',
    selector
)
const AffEchoLost = new EchoLinePrefix(
    { text: ' -aff ', fg: 'orange' },
    'red',
    '',
    selector
)
const DefEchoGot = new EchoLinePrefix(
    { text: ' +def ', fg: 'purple' },
    'green',
    '',
    selector
)
const DefEchoLost = new EchoLinePrefix(
    { text: ' -def ', fg: 'purple' },
    'red',
    '',
    selector
)
const BalanceEchoGot = new EchoLinePrefix(
    { text: ' onBal ', fg: 'brown' },
    'green'
)
const BalanceEchoLost = new EchoLinePrefix(
    { text: ' offBal ', fg: 'brown' },
    'red'
)
const PrioritySetEcho = new EchoLinePrefix(
    { text: 'priority change: ', fg: 'yellow' },
    'red',
    '',
    selector
)

const gotTrackable = function (data) {
    if (sys.settings.echoTrackableGot) {
        TrackableEchoGot.echo(data.name)
    }
}

const lostTrackable = function (data) {
    if (sys.settings.echoTrackableLost) {
        TrackableEchoLost.echo(data.name)
    }
}

const gotAff = function (data) {
    if (sys.settings.echoAffGot) {
        AffEchoGot.echo(data.name)
    }
}

const lostAff = function (data) {
    if (sys.settings.echoAffLost) {
        AffEchoLost.echo(data.name)
    }
}

const gotDef = function (data) {
    if (sys.settings.echoDefGot) {
        DefEchoGot.echo(data.name)
    }
}

const lostDef = function (data) {
    if (sys.settings.echoDefLost) {
        DefEchoLost.echo(data.name)
    }
}

// CUSTOM to replace balance and equilibrium messages
const gotBalance = function (data) {
    if (['equilibrium', 'balance'].includes(data.name)) {
        window.display_notice(
            'You have recovered ' + data.name,
            '#00ccff',
            'black',
            ' (' + data.duration.toFixed(2) + ')',
            '#33cc33',
            'black'
        )
        return
    }

    if (sys.settings.echoBalanceGot && data.name !== 'SystemOutput') {
        BalanceEchoGot.echo(data.name + '(' + data.duration.toFixed(2) + ')')
    }
}

const lostBalance = function (data) {
    if (sys.settings.echoBalanceLost) {
        BalanceEchoLost.echo(data.name)
    }
}

const prioritySet = function (data) {
    if (sys.settings.echoPrioritySet) {
        PrioritySetEcho.echo(data.name + ' ' + data.prio)
    }
}

eventStream.removeListener('TrackableGot', 'gotTrackable')
eventStream.removeListener('TrackableLost', 'lostTrackable')
eventStream.removeListener('AffGot', 'gotAff')
eventStream.removeListener('AffLost', 'lostAff')
eventStream.removeListener('DefGot', 'gotDef')
eventStream.removeListener('DefLost', 'lostDef')
eventStream.removeListener('BalanceGot', 'gotBalance')
eventStream.removeListener('BalanceLost', 'lostBalance')
eventStream.removeListener('PrioritySetEvent', 'prioritySet')

eventStream.registerEvent('TrackableGot', gotTrackable)
eventStream.registerEvent('TrackableLost', lostTrackable)
eventStream.registerEvent('AffGot', gotAff)
eventStream.registerEvent('AffLost', lostAff)
eventStream.registerEvent('DefGot', gotDef)
eventStream.registerEvent('DefLost', lostDef)
eventStream.registerEvent('BalanceGot', gotBalance)
eventStream.registerEvent('BalanceLost', lostBalance)
eventStream.registerEvent('PrioritySetEvent', prioritySet)

const SystemOutputDisplay = new Echo('red')

const systemOutputSentDisplay = function (output) {
    SystemOutputDisplay.echo('(' + output.join('|') + ')')
}

eventStream.registerEvent('OutputSentEvent', systemOutputSentDisplay)

const DorEchoStart = new EchoLinePrefix(
    { text: '[dor]: ', fg: 'green' },
    'white'
)
const DorEchoStop = new EchoLinePrefix({ text: '[dor]: ', fg: 'red' }, 'white')
const DorEchoExecuted = new EchoLinePrefix(
    { text: '[dor]: ', fg: 'green' },
    'white'
)

const doRepeatStartedDisplay = function (dor) {
    DorEchoStart.echo(
        'Looping ' + dor.command + ' every ' + dor.length + ' seconds'
    )
}
eventStream.registerEvent('DorDoRepeatStartedEvent', doRepeatStartedDisplay)

const doRepeatStoppedDisplay = function (dor) {
    DorEchoStop.echo('Stopped repeating')
}
eventStream.registerEvent('DorDoRepeatStoppedEvent', doRepeatStoppedDisplay)

const doRepeatExecutedDisplay = function (dor) {
    DorEchoExecuted.echo(dor.command)
}
eventStream.registerEvent('DorDoRepeatExecutedEvent', doRepeatExecutedDisplay)
