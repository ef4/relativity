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
    {withId: [1, [1, 0]], from: [0, [0, 2, 5], 7], to: 14},
    {withId: [[1,0], 1], from: [[0, 1, 31], [0, 2, 5], 7], to: 39},
    {
      withId: [[1, [1, 0]], [[1,0], 1]],
      from: [[0, [0, 2, 5], 7], [[0, 1, 31], [0, 2, 5], 7], 17],
      to: [0, 39-14, 17+14]
    },
    {withId: [0,1], from: 2, to: [0, 1, 2]},
    {withId: 1, from: 2, to: 3},
    {
      withId: [[0,1],1],
      from: [[0, 1, 0],[0, [0, 1, 0], 0], 0],
      to: [[0, 1, 0], 1, 0]
    },
    {
      withId: [[0,1],[0, 1]],
      from: [[0, 1, 0],[0, [0, 1, 0], 0], 0],
      to: [[0, 1, 0], [0, 1, 0], 0]
    },
    {
      withId: [[0,1],[0, [0, 1]]],
      from: [[0, 1, 0],[0, [0, 1, 0], 0], 0],
      to: [[0, 2, 0], [0, [0, 1, 0], 0], 0]
    },
  ];
  expect(examples.length);
  examples.forEach(function(example) {
    var s = new Stamp(new ID(example.withId), new Event(example.from));
    deepEqual(s.event().flatten(), [example.withId, example.to]);
  });
});

test("anonymous event", function() {
  throws(function() {
    new Stamp(new ID(0), new Event([1, 0, 0])).event();
  }, "cannot register new events on an anonymous stamp");
});
