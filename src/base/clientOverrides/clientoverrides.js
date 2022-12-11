/* global nexusclient, nexSys */

const generate_chunk = (text, fg, bg) => {
  let result = document.createElement("span");
  result.style.color = fg;
  result.style.backgroundColor = bg;
  result.innerHTML = text;

  return result;
};

// Override display_notice() for multi color options.
//nexusclient.display_notice()
const display_notice = function (...args) {
  let htmlLine = document.createElement("span");

  for (let i = 0; i < args.length; i += 3) {
    htmlLine.appendChild(generate_chunk(args[i], args[i + 1], args[i + 2]));
  }

  nexusclient.add_html_line(htmlLine.outerHTML);
  return htmlLine.outerHTML;
};

const prepend_notice = function (...args) {
  let htmlLine = document.createElement("span");

  for (let i = 0; i < args.length; i += 3) {
    htmlLine.appendChild(generate_chunk(args[i], args[i + 1], args[i + 2]));
  }

  nexSys.prepend_line = {
    timestamp: nexusclient.current_block[1].timestamp,
    timestamp_ms: nexusclient.current_block[1].timestamp_ms,
    parsed_line: {
      text() {
        return htmlLine.outerHTML;
      },
      formatted() {
        return htmlLine.outerHTML;
      },
    },
  };
  return htmlLine.outerHTML;
};

// Override the add_block to substitute nexSys custom prompts in.
//nexusclient.ui().buffer().add_block
const add_block = function (block) {
  if (nexSys.prepend_line) {
    block.unshift(nexSys.prepend_line);
    nexSys.prepend_line = false;
  }
  let count = 0;
  let gags = 0;
  for (let idx = 0; idx < block.length; ++idx) {
    var l = block[idx];

    if (l.gag) {
      gags++;
      continue;
    }
    if (!l.parsed_line && !l.html_line) continue;
    // no prompt if we gagged everything
    if (l.is_prompt && (gags >= block.length - 2)) continue;
    // empty line? include if it's not the first/last one
    if (l.parsed_line) {
      let text = l.parsed_line.text();
      if (!text && (count === 0 || idx === block.length - 1)) continue;
    }

    this._fill_tab_completion(l);
    count++;
    this.lineid++;
    l.id = this.lineid;
    if (l.is_prompt && nexSys.sys.settings.customPrompt) {
      let nexSysPromptString = nexSys.prompt.getCustomPrompt();
      l.parsed_line.formatted = () => {
        return nexSysPromptString;
      };
    }

    this.lines.push(l);
    this.unread = true;
  }
  let pruned = this.prune_lines();
  if (count || pruned) this.on_lines_changed();
};

nexusclient.display_notice = display_notice;
nexusclient.ui().buffer().add_block = add_block;
nexSys.prepend_notice = prepend_notice;
