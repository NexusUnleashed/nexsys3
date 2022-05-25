// Tael's display_notice extension
//
// Adds support for multi-chunk display notices.
//
// API:
// display_notice(TEXT)
//     Displays TEXT.
// display_notice(TEXT, FG_COLOR)
//     Displays TEXT in the color of FG_COLOR.
//     Example of printing "Oh no!" in red:
//         display_notice("Oh no!", "red");
// display_notice(TEXT, FG_COLOR, BG_COLOR)
//     Displays TEXT in the colour of FG_COLOR on a BG_COLOR background.
//     Note: Use "" for default colours.
//     Example of printing "Oh no!" in red on blue:
//         display_notice("Oh no!", "red", "blue");
//     Example of printing "Oh no!" in default text colour on blue:
//         display_notice("Oh no!", "", "blue");
// display_notice(TEXT, FG_COLOR, BG_COLOR, TEXT2, FG_COLOR2, BG_COLOR2...)
//     Displays TEXT in the colour of FG_COLOR on a BG_COLOR background followed by TEXT2 in the colour of FG_COLOR2 on a BG_COLOR background.
//     Note: If the last FG_COLOR or BG_COLOR is unspecified or any FG_COLOR or BG_COLOR is "", the colours will be the last defined FG_COLOR or BG_COLOR (they will not revert to default colours).
//     Note: Set FG_COLOR to "reset" to return text and background colour to default (accompanying BG_COLOR will be ignored). There is no way to revert text or background colour independently.
//     Example of printing "Oh no!" in red on blue followed by " Anything but that!" in orange on green.
//         display_notice("Oh no!", "red", "blue", " Anything but that!", "orange", "green");
//     Example of printing "Oh no!" in red on blue followed by " Anything but that!" in orange on blue.
//         display_notice("Oh no!", "red", "blue", " Anything but that!", "orange");
//     Example of printing "Oh no!" in red on blue followed by " Anything but that!" in default colours.
//         display_notice("Oh no!", "red", "blue", " Anything but that!", "reset");
//     Example of printing "Oh no!" in red on blue followed by " Anything but that!" in default text colour on blue:
//         display_notice("Oh no!", "red", "blue", "", "reset", "", " Anything but that!", "", "blue");
//     Example of printing "Oh no!" in red on blue followed by " Anything but that!" in orange, then " This is madness!" in default colours, then " Why?!" in red.
//         display_notice("Oh no!", "red", "blue", " Anything but that!", "orange", "", " This is madness!", "reset", "", " Why?!", "red");

client.display_notice = function (...args) {
  let selector = '#output_main';
 
  if (args[0].indexOf('#') != -1) {
    selector = args.splice(0,1)[0];
  }
  
  if (!args[0] || !args[0].length) {
      if(args[0] !== "") { // some variables will send in "", just pretend we're formatting no text
          return;
      }
  }
  let bg;
  let chunk = [];
  let chunks = [];
  let fg;
  let text;
  chunks.length = Math.ceil(args.length / 3);
  chunks = chunks.fill().map((ignore, i) => args.slice(i * 3, i * 3 + 3));
  for (let e of chunks) {
      text = e[0];
      fg = e[1];
      bg = e[2];
      bg = client.convert_bgcolor(bg);
      chunk.push(linechunk_color(fg, bg));
      chunk.push(linechunk_text(text));
  }
  let line = {};
  line.parsed_line = linechunks_create(chunk);
  line.no_triggers = true;

  if (client.current_block) {
      let idx = client.current_block.length;
      if (client.current_line) idx = client.current_block.indexOf(client.current_line) + 1;
      client.current_block.splice(idx, 0, line);
  } else {
      let lines = [];
      lines.push(line);
      client.display_text_block(lines, selector);
  }
};

client.display_text_block = function(lines, selector = '#output_main') {
  var block = generate_text_block(lines);
  update_text_completion(lines);
  if (block.length)
      ow_Write(selector, block);
}

// THIS FUNCTION NEEDS TO BE CALLED AGAIN IN ANOTHER PACKAGE OTHERWISE ERRORS OCCUR. WHO KNOWS WHY.
client.generate_text_block = function(lines) {
  let customPromptEnabled = nexSys?.sys?.settings?.customPrompt;
  let count = 0;

  let timestamp;
  if (client.show_timestamp_milliseconds === true)
      timestamp = client.getTimeMS();
  else
      timestamp = client.getTimeNoMS();
  let cl = "timestamp mono no_out";
  timestamp = "<span class=\"" + cl + "\">" + timestamp + "&nbsp;</span>";

  let res = '';

  let counter = 0;
  for (let i = 0; i < lines.length; ++i) {
      let txt = lines[i].parsed_line;
      let font = lines[i].monospace ? 'mono' : '';
      let line = "<p class=\"" + font + "\">" + timestamp + (txt ? txt.formatted() : '') + "</p>";

      if (lines[i].gag) continue;
      //////// Moved because don't want gagged lines
      if (logging && txt) append_to_log(line);

      //if (lines[i].gag) continue;
      counter++;
      
      // Added this snippet to allow print() to inject lines
  if (lines[i].type == 'html') {
        line = "<div class=\"" + font + "\">" + timestamp + lines[i].line + "</div>";
          txt = true;
      }
      
      if (txt) {
          count++;
          res += line;
      }
      let pr = lines[i].parsed_prompt;
      if (pr && (count > 0)) {   // no prompt if we gagged everything

          //////// Added
          if(customPromptEnabled) {
              lines[i] = nexSys.prompt.getCustomPrompt();
              pr = lines[i].parsed_prompt;
          }
          line = "<p class=\"prompt " + font + "\">" + timestamp + pr.formatted() + "</p>";
          if (logging) append_to_log(line);
          res += line;
      }
      
      // empty line - include it if it's neither the first nor the last one
      // using "counter" instead of "i" fixes problems where the empty line is included after channel markers and such
      if ((!pr) && (!txt) && (counter > 1) && (i < lines.length - 1)) {
          res += '<p>' + timestamp + '&nbsp;' + '</p>';
      }
  }
  if (client.extra_break && res.length) res += "<br />";
  return res;
};

// Rewriting the print method to interact with the generate_text_block. This will allow us to use print()
// within a text block. Normally print() always displays before the entire text block regardless of which
// line triggers it.
// setting html = true will display in line with the text block. print('stuff', true)
/*client.print = function(s, html = false)
{
  var color = "#ccc";
  var bg_color = "transparent";
  if (typeof arguments[1] != undefined)
      color = arguments[1];
  if (typeof arguments[2] != undefined)
      bg_color = arguments[2];
  
  if (client.current_block && html) {
      let inline = {
          line: "<div style='color:"+color+ "; background:"+bg_color+"'>" + s + "</div>",
          type: html ? 'html' : ''
      }
      let idx = client.current_block.length;
      if (client.current_line) idx = client.current_block.indexOf(client.current_line) + 1;
      client.current_block.splice(idx, 0, inline);
  } else {
      ow_Write("#output_main", "<div style='color:"+color+ "; background:"+bg_color+"'>" + s + "</div>");
  }
}*/
client.printHTML = function(s, selector = '#output_main')
{   
  if (client.current_block && html) {
      let inline = {
          line: s,
          type: 'html'
      }
      let idx = client.current_block.length;
      if (client.current_line) idx = client.current_block.indexOf(client.current_line) + 1;
      client.current_block.splice(idx, 0, inline);
  } else {
      let timestamp;
      if (client.show_timestamp_milliseconds === true)
          timestamp = client.getTimeMS();
      else
          timestamp = client.getTimeNoMS();
      let cl = "timestamp mono no_out";
      timestamp = "<span class=\"" + cl + "\">" + timestamp + "&nbsp;</span>";
      ow_Write(selector, timestamp+s);
  }
}
/*
client.send_direct = function(input, no_expansion)
{
  if (!input || typeof input == undefined)
      return false;

  var do_expansion = !no_expansion;

  if (typeof input != "string")
      input = input.toString();

  client.command_counter++;
  if (client.command_counter >= 200) {
      if (client.command_counter == 200)
          print('You seem to have sent more than 200 commands within a second. You probably have some runaway trigger or an endless alias loop - disabling commands for a while.', '#FF8080');
      client.setup_command_counter();  // just in case -- had the interval disappear at one point
      return;
  }

  var real_cmds = [];
  if (do_expansion) {
      var commands = [];
      var split_regex = new RegExp(escapeRegExp(client.stack_delimiter), 'gm');
      var parts = input.split(split_regex);

      // Delimiter split
      for (var i = 0; i < parts.length; ++i) {
          var cmd = parts[i];
          if (cmd == "") continue;
          var cmds = [];
          // Aliases
          if (aliases_enabled)
              cmds = handle_aliases(cmd);
          else
              cmds.push(cmd);

          for (var j = 0; j < cmds.length; ++j)
              commands.push(cmds[j]);
      }

      // Now process internal commands, expand variables and execute functions.
      for (var i = 0; i < commands.length; ++i) {
          var cmd = commands[i];

          if (cmd.indexOf("@set") == 0)
          {
              var temp = cmd.split(/ /);
              if (temp[1] != "" && temp[2] != "")
              {
                  if (client.set_variable(temp[1], temp[2]))
                  {
                      print("Set " + temp[1] + " to " + temp[2]);
                      display_variables();
                  }
                  continue;
              }
          }

          if (variables_enabled) cmd = handle_variables(cmd);

          if (functions_enabled)
          {
              cmd = handle_functions(cmd);
              if (!cmd) continue;
          }

          // This is a real command - add it to the queue
          real_cmds.push(cmd);
      }
  } else
      real_cmds.push(input);   // skip the cmds loop entirely if we don't expand anything

  if (!real_cmds.length) return;
  if (!ws) return;

  for (var i = 0; i < real_cmds.length; ++i) {
      var s = real_cmds[i];
      if (client.echo_input)
          print(`<span style='color:${client.color_inputecho}'>${s}</span>`, true); // nexSys: We rewrite this portion to work with our new print()
      ws_send(s + "\r\n");
  }
  last_send = new Date().getTime();
}*/


client.set_variable = function(name, value)
{
  if (typeof name != 'string') return;
  if (name.indexOf ('"') >= 0) return;
  if (name.indexOf ('\\') >= 0) return;
  name = name.trim();
  if (name[0] == '@') name = name.substr(1);

  client.vars[name] = value;
  
  if (name == 'tar' && nexSys.sys.target != value) {
    nexSys.sys.target = value;
  }
}