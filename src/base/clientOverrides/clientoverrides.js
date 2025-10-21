/* global nexusclient, nexSys */

const generate_chunk = (text, fg, bg) => {
  let result = document.createElement("span");
  result.style.color = fg;
  result.style.backgroundColor = bg;
  result.innerHTML = text;

  return result;
};

// DEPRECATED: This functionality was incorporated into Nexus.
// Override display_notice() for multi color options.
//nexusclient.display_notice()
/*
const display_notice = function (...args) {
  let htmlLine = document.createElement("span");

  for (let i = 0; i < args.length; i += 3) {
    htmlLine.appendChild(generate_chunk(args[i], args[i + 1], args[i + 2]));
  }

  nexusclient.add_html_line(htmlLine.outerHTML);
  return htmlLine.outerHTML;
};
*/

// Override the add_block to substitute nexSys custom prompts in.
//nexusclient.ui().buffer().add_block
const add_block = function (block) {
  // Inject html line at the begining of a block.
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
    if (l.is_prompt && !count) {
      l.gag = true; // nexSys: This prevents prompt lines from logging when all text is gagged
      continue;
    }
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
const process_lines = function (lines) {
  if (this.gagged) return;
  // Nothing to do if there are no lines. Happens when we receive a GMCP message.
  if (!lines.length) return;

  this.current_block = lines;
  let reflexes = this.reflexes();

  for (var idx = 0; idx < lines.length; ++idx) {
    if (idx >= 1000) break; // just in case we somehow hit an infinite loop (notifications mainly)

    // this is for custom functions/scripts
    this.current_line = lines[idx];
    this.current_line.index = idx;

    if (lines[idx].line && lines[idx].line.indexOf(String.fromCharCode(7)) >= 0)
      // line contains the beep char
      this.platform().beep();

    if (!this.fullstop) lines = reflexes.handle_triggers(lines, idx);
  }

  reflexes.run_function("onBlock", lines, "ALL");

  this.buffer().add_block(lines);

  this.current_line = undefined;
  this.current_block = undefined;
};

const on_key_up = function (key, isAlt, isCtrl, isShift) {
  if (!this._nexus.datahandler().is_connected()) return true;
  if (this.dialog_has_focus()) return true; // nothing if we're in some dialog
  if (!this.tab_pressed) {
    if (nexSys.sys.settings.overrideTab === true) {
      nexSys.tabCompletion.reset();
    }
    return true;
  }

  if (key === 9) {
    // TAB-targeting
    // this can only happen on releasing the key, as upon pressing it we do not yet know if we're going to also press Space or not
    this.tab_pressed = false;
    if (nexSys.sys.settings.overrideTab === true) {
      nexSys.tabCompletion.tc();
      return false;
    }
    if (!this.player_targetted)
      // this check ensures that we don't target a mob after releasing Tab after the Tab+Space press
      this._nexus.datahandler().tab_target(false);
    this.player_targetted = false;

    // this.focus_input();
    return false;
  }

  return true;
};

nexusclient.process_lines = process_lines;
//nexusclient.display_notice = display_notice;
nexusclient.buffer().add_block = add_block;
nexusclient.platform().on_key_up = on_key_up;

nexusclient.datahandler().send_command = function (command) {
  if (!this._socket) return;
  const time = Date.now(); // Performance this is 2x as fast as new Date().getTime() in default Nexus
  nexSys.sentCommands = [
    ...nexSys.sentCommands.slice(0, 199),
    { cmd: command, time: time },
  ];
  this._socket.send(command + "\r\n");
  //this.last_send = new Date().getTime();
  this.last_send = time;
};
