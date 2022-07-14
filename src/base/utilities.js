import { eventStream } from './eventStream.js'
import { sys } from './sys'

export function sendCmd(cmd) {
    if (cmd) {
        window.nexusclient.send_commands(cmd)
    }
    eventStream.raiseEvent('SendCommandEvent', cmd)
}

export function psend(what) {
    if (!sys.isPaused()) {
        sendCmd(what)
    }
}

export function rsend(what) {
    if (!sys.isSlowMode()) {
        psend(what)
    }
}

// get diff from now with previous time, input ms get seconds
export function timeDiffNow(prev) {
    return (performance.now() - prev) / 1000
}

export function sendInline(cmd) {
    if (Array.isArray(cmd)) sendCmd(cmd.join(sys.settings.sep))
    eventStream.raiseEvent('SendCommandEvent', cmd)
}

const generate_chunk = (text, fg, bg) => {
    let result = document.createElement('span');
    result.style.color = fg;
    result.style.backgroundColor = bg;
    result.innerHTML = text;

    return result;
}
export function display_notice(...args) {
    let htmlLine = document.createElement('p');
    let chunks = [];
    let fg, bg, text;
    chunks.length = Math.ceil(args.length / 3);
    chunks = chunks.fill().map((ignore, i) => args.slice(i * 3, i * 3 + 3));
    for (let e of chunks) {
        text = e[0];
        fg = e[1];
        bg = e[2];
        htmlLine.appendChild(generate_chunk(text, fg, bg))
    }
    
    return htmlLine.outerHTML;
}