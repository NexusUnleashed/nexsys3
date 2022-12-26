import { eventStream } from "../base/eventStream";

describe("basic eventStream functionality", () => {
  test("eventStream loaded", () => {
    expect(eventStream).toBeDefined();
  });

  test("add event to eventStream", () => {
    let testEvent = () => {
      console.log("hello world");
    };
    eventStream.registerEvent("testEvent", testEvent);
    expect(eventStream.stream).toHaveProperty("testEvent");
  });

  test("remove event by name from eventStream", () => {
    eventStream.removeListener("testEvent", "testEvent");
    expect(eventStream.stream["testEvent"]).toHaveLength(0);
  });

  test("remove event by object from eventStream", () => {
    let testEvent = () => {
      console.log("hello world");
    };
    eventStream.registerEvent("testEvent", testEvent);
    eventStream.removeListener("testEvent", testEvent);
    expect(eventStream.stream["testEvent"]).toHaveLength(0);
  });
});
