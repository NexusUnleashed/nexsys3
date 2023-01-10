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
const speech = new SpeechSynthesisUtterance();
speech.voice =
  globalThis.speechSynthesis
    .getVoices()
    .find((e) => e.voiceURI === "Google UK English Female") ||
  globalThis.speechSynthesis.getVoices()[5];
speech.rate = 1;
speech.pitch = 1.1;
export const say = (txt) => {
  speech.text = txt;
  globalThis.speechSynthesis.speak(speech);
};
