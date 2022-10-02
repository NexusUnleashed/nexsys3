import { Echo, EchoLine, EchoLinePrefix } from "./Echo";

export const echo = new Echo("white").echo;

export const echoLine = new EchoLine("white").echo;

export const echoInfoLine = new EchoLinePrefix({ text: "[Info]: ", fg: "yellow" }, "white").echo;