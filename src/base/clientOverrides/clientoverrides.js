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
const display_notice = function(...args) {
  let htmlLine = document.createElement("span");

  for (let i = 0; i < args.length; i += 3) {
    htmlLine.appendChild(generate_chunk(args[i], args[i + 1], args[i + 2]));
  }

  nexusclient.add_html_line(htmlLine.outerHTML);
  return htmlLine.outerHTML;
};

const prepend_notice = function(...args) {
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
const add_block = function(block) {
  if (nexSys.prepend_line) {
    block.unshift(nexSys.prepend_line);
    nexSys.prepend_line = false;
  }
  let count = 0;
  for (let idx = 0; idx < block.length; ++idx) {
    var l = block[idx];

    if (l.gag) continue;
    if (!l.parsed_line && !l.html_line) continue;
    // no prompt if we gagged everything (so far)
    if (l.is_prompt && !count) continue;
    // empty line? include if it's not the first/last one
    if (l.parsed_line) {
      let text = l.parsed_line.text();
      if (!text && (count === 0 || idx === block.length - 1)) continue;
    }

    this._fill_tab_completion(l);
    count++;
    this.lineid++;
    l.id = this.lineid;

    // Inject custom nexSys prompt
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

//Override the process_lines function to move logging after the
//add_block function to allow custom prompt logging
//nexusclient.process_lines();
const process_lines = function(lines) {
  if (this.gagged) return;
  // Nothing to do if there are no lines. Happens when we receive a GMCP message.
  if (!lines.length) return;

  this.current_block = lines;
  let reflexes = this.reflexes();

  for (var idx = 0; idx < lines.length; ++idx) {
      if (idx >= 1000) break;   // just in case we somehow hit an infinite loop (notifications mainly)

      // this is for custom functions/scripts
      this.current_line = lines[idx];

      if (lines[idx].line && (lines[idx].line.indexOf(String.fromCharCode(7)) >= 0))  // line contains the beep char
          this.platform().beep();
      
      if (!this.fullstop)
          lines = reflexes.handle_triggers(lines, idx);
  }

  reflexes.run_function("onBlock", lines, 'ALL');

  this.ui().buffer().add_block (lines);
  // Logging - this is called after triggers so that we get the processed lines
  // Nexsys: Moved logging after add_block for custom prompt capture
  for (var idx = 0; idx < lines.length; ++idx)
      this.log().append(lines[idx]);

  this.current_line = undefined;
  this.current_block = undefined;
};


nexusclient.process_lines = process_lines;
nexusclient.display_notice = display_notice;
nexusclient.ui().buffer().add_block = add_block;
nexSys.prepend_notice = prepend_notice;
