import nexSys from "./nexsys";
import eventStream from "./base/eventstream"

test('eventStream loaded', () => {
  expect(eventStream).toBe(!undefined)
});