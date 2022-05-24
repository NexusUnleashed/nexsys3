import nexSys from "./nexSys";
import eventStream from "./base/eventStream"

test('eventStream loaded', () => {
  expect(eventStream).toBe(!undefined)
});