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

export const replaceWord = (word, fg, bg) => {
  let line = globalThis.nexusclient.current_line.parsed_line
    .text()
    .replaceAll(
      word,
      `<span style="color:${fg};background:${bg}">${word}</span>`
    );
  globalThis.nexusclient.current_line.parsed_line.formatted = () => {
    return line;
  };

  return true;
};

const speech = new SpeechSynthesisUtterance();
speech.voice =
  globalThis.speechSynthesis
    .getVoices()
    .find((e) => e.voiceURI === "Google UK English Female") ||
  globalThis.speechSynthesis.getVoices()[5];
speech.rate = 1.1;
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
      .at(-1);
    this.re ??= new RegExp(`\\b${window._.capitalize(this.qry)}\\w*\\b`);
    //this.vals ??= GMCP.WhoList.filter(e => e.name.match(this.re)).map(n => n.name);
    this.vals ??= [
      ...new Set([
        ...(nexGui?.colors?.enemies || []),
        ...GMCP.WhoList.filter((e) => e.name.match(this.re)).map((n) => n.name),
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
