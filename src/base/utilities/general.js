// TODO: We should probably move this somewhere else
const generateChunk = (text, fg, bg) => {
  let result = document.createElement("span");
  result.style.color = fg;
  result.style.backgroundColor = bg;
  result.textContent = text;

  return result;
};
export const replace = (...args) => {
  let htmlLine = document.createElement("span");

  for (let i = 0; i < args.length; i += 3) {
    htmlLine.appendChild(generateChunk(args[i], args[i + 1], args[i + 2]));
  }
  globalThis.nexusclient.current_line.parsed_line.formatted = () => {
    return htmlLine.outerHTML;
  };

  return true;
};
export const replaceHTML = (html) => {
  globalThis.nexusclient.current_line.parsed_line.formatted = () => {
    return html;
  };

  return true;
};

export const replaceWord = (word, replaceWord, fg, bg) => {
  let replacement =
    replaceWord.indexOf("/>") > -1
      ? replaceWord
      : `<span style="color:${fg};background:${bg}">${replaceWord}</span>`;

  let line = globalThis.nexusclient.current_line.parsed_line
    .formatted()
    .replaceAll(word, replacement);
  globalThis.nexusclient.current_line.parsed_line.formatted = () => {
    return line;
  };

  return true;
};
export const prevLine = (pattern) => {
  const index = nexusclient.current_block.indexOf(nexusclient.current_line);
  if (index === 0) {
    return false;
  }

  let result = false;
  const text = nexusclient.current_block[index - 1].parsed_line.text();

  if (typeof pattern === "string") {
    result = text.includes(pattern);
  } else if (pattern instanceof RegExp) {
    result = pattern.test(text);
  }

  return result;
};

export const nextLine = (pattern) => {
  const index = nexusclient.current_block.indexOf(nexusclient.current_line);
  if (index === nexusclient.current_block.length - 1) {
    return false;
  }

  let result = false;
  const text = nexusclient.current_block[index + 1].parsed_line.text();

  if (typeof pattern === "string") {
    result = text.includes(pattern);
  } else if (pattern instanceof RegExp) {
    result = pattern.test(text);
  }

  return result;
};
export const checkLine = (pattern, position) => {
  const index = nexusclient.current_block.indexOf(nexusclient.current_line);
  if (position > 0) {
    if (index + position > nexusclient.current_block.length - 1) {
      return false;
    }
  } else {
    if (index + position < 0) {
      return false;
    }
  }

  let result = false;
  const text = nexusclient.current_block[index + position].parsed_line.text();

  if (typeof pattern === "string") {
    result = text.includes(pattern);
  } else if (pattern instanceof RegExp) {
    result = pattern.test(text);
  }

  return result;
};

export const prepend_notice = function (...args) {
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

export const updateNxs = () => {
  //fetch(`https://unpkg.com/nexsys@${nexSys.currentVersion}/nexSys3.nxs`, {
  fetch(`https://unpkg.com/nexsys/nexSys3.nxs`, {
    cache: "no-store",
  })
    .then((response) => response.json())
    .then((data) => {
      nexusclient.packages().get("nexSys3").apply(data, nexusclient.reflexes());
      nexusclient
        .packages()
        .get("nexSys3")
        .items.filter((item) => item.type === "group")
        .forEach((group) => (group.enabled = true));
    });
};

const speech = new SpeechSynthesisUtterance();
speech.voice =
  globalThis.speechSynthesis
    .getVoices()
    .find((e) => e.voiceURI === "Google UK English Female") ||
  globalThis.speechSynthesis.getVoices().find((e) => e.lang === "en-US");
speech.rate = 1.05;
speech.pitch = 1.1;
export const say = (txt) => {
  speech.text = txt;
  globalThis.speechSynthesis.speak(speech);
};

export const tabCompletion = {
  txt: null,
  qry: null,
  vals: null,
  index: 0,
  re: null,
  reset() {
    this.txt = null;
    this.qry = null;
    this.re = null;
    this.vals = null;
    this.index = 0;
  },
  tc() {
    this.txt ??= document.getElementsByTagName("textarea")[0].value.split(" ");
    this.qry ??= document
      .getElementsByTagName("textarea")[0]
      .value.split(" ")
      .at(-1)
      .capitalize();
    /* Regex version
    this.re ??= new RegExp(`\\b${this.qry.capitalize()}\\w*\\b`);
    //this.vals ??= GMCP.WhoList.filter(e => e.name.match(this.re)).map(n => n.name);
    this.vals ??= [
      ...new Set([
        ...(globalThis.nexGui?.colors?.enemies || []),
        ...GMCP.WhoList.filter((e) => e.name.match(this.re)).map((n) => n.name),
      ]),
    ];
    */
    this.vals ??= [
      ...new Set([
        ...(globalThis.nexGui?.colors?.enemies || []),
        ...GMCP.WhoList.filter((e) => e.name.startsWith(qry)).map(
          (n) => n.name
        ),
      ]),
    ];
    if (this.vals.length === 0) {
      return;
    }
    if (this.index > this.vals.length - 1) {
      this.txt[this.txt.length - 1] = this.qry;
      this.index = 0;
    } else {
      this.txt[this.txt.length - 1] = this.vals[this.index];
      this.index++;
    }
    document.getElementsByTagName("textarea")[0].value = this.txt.join(" ");
    //console.log(this.txt.join(" "));
  },
};
