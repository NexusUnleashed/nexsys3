/* global */
import { display_notice } from "./clientoverrides"

export class Echo {
    constructor(fg, bg, selector) {
        this._fg = fg || 'white'
        this._bg = bg
        this._selector = selector || '#output_main'
        this.echo = this.echo.bind(this)
    }

    echo(text) {
        display_notice(text, this._fg, this._bg)
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
        display_notice(
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