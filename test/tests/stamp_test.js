import Stamp from "relativity";
import Event from "relativity/event";
import ID from "relativity/id";

module("Stamp");

test("create", function() {
  ok((new Stamp()) instanceof Stamp, "Created a stamp with new");
  ok(Stamp() instanceof Stamp, "Created a stamp without new");  
});


test("event", function() {
  var examples = [
    {withId: [1,0], from: [[1,0,0], 1, 1], to: 2},
    {withId: 1, from: [1, 0, 0], to: 1},
    {withId: [1, [1, 0]], from: [0, [0, 2, 5], 7], to: 14}
    //{withId: [0,1], from: 2, to: 3},
    //{withId: 0, from: [1, 0, 0], to: [1, 0, 0]},
  ];
  expect(examples.length);
  examples.forEach(function(example) {
    var s = new Stamp(new ID(example.withId), new Event(example.from));
    deepEqual(s.event().flatten(), [example.withId, example.to]);
  });
});
