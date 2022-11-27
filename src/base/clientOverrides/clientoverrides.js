/* global nexusclient, nexsys */

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

// Override the add_block to substitute nexsys custom prompts in.
//nexusclient.ui().buffer().add_block
const add_block = function (block) {
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
    if (l.is_prompt && gags) continue;
    // empty line? include if it's not the first/last one
    if (l.parsed_line) {
      let text = l.parsed_line.text();
      if (!text && (count === 0 || idx === block.length - 1)) continue;
    }

    this._fill_tab_completion(l);
    count++;
    this.lineid++;
    l.id = this.lineid;
    if (l.is_prompt && nexsys.sys.settings.customPrompt) {
      let nexsysPromptString = nexsys.prompt.getCustomPrompt();
      l.parsed_line.formatted = () => {
          return nexsysPromptString;
        }
      };

    this.lines.push(l);
    this.unread = true;
  }
  let pruned = this.prune_lines();
  if (count || pruned) this.on_lines_changed();
};

nexusclient.display_notice = display_notice;
nexusclient.ui().buffer().add_block = add_block;
