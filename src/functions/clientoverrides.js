/* global nexsys, nexusclient */

const generate_chunk = (text, fg, bg) => {
  let result = document.createElement('span');
  result.style.color = fg;
  result.style.backgroundColor = bg;
  result.innerHTML = text;

  return result;
}
//nexusclient.display_notice()
const display_notice = function(...args) {
  let htmlLine = document.createElement('span');
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
  
  nexusclient.add_html_line(htmlLine.outerHTML);
  return htmlLine.outerHTML;
}

//nexusclient.ui().buffer().add_block
const add_block = function(block) {
  let count = 0;
  let gags = 0;
  for (let idx = 0; idx < block.length; ++idx)
  {
      var l = block[idx];

      if (l.gag) {
          gags++;
          continue;
      }
      if ((!l.parsed_line) && (!l.html_line)) continue;
      // no prompt if we gagged everything
      if (l.is_prompt && gags) continue;
      // empty line? include if it's not the first/last one
      if (l.parsed_line) {
          let text = l.parsed_line.text();
          if ((!text) && ((count === 0) || (idx === block.length - 1))) continue;
      }

      this._fill_tab_completion(l);
      count++;
      this.lineid++;
      l.id = this.lineid;
      if (l.is_prompt && nexsys.customPromptEnabled) {
          l.parsed_line = {
                  formatted() {return 'PUT THE NEXSYS PROMPT FUNCTION HERE'}
          }
      }
                        
      this.lines.push (l);
      this.unread = true;
  }
  let pruned = this.prune_lines();
  if (count || pruned) this.on_lines_changed();
}

nexusclient.display_notice = display_notice;
nexusclient.ui().buffer().add_block = add_block;