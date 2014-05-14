import Event from "relativity/event";

module("Event");

test("creation", function(){
  var e = new Event([1, [2, 3, 4], 5]);
  strictEqual(e.interior(), 5);
  strictEqual(e.right().left().leaf(), 2);
  strictEqual(e.right().interior(), 4);
});

test("min", function() {
  var examples = [
    {from: 0, to: 0},
    {from: [1, 2, 7], to: 8}
  ];
  for (var i=0; i<examples.length; i++) {
    deepEqual(new Event(examples[i].from).min(), examples[i].to);
  };
});

test("normalize", function() {
  var examples = [
    {from: [1, 3, 7], to: [0, 2, 8]},
    {from: [3, 3, 7], to: 10},
    {from: [[3, 3, 7], 10, 1], to: 11}
  ];
  for (var i=0; i<examples.length; i++) {
    deepEqual((new Event(examples[i].from)).normalize().flatten(), examples[i].to);
  };

});

test("comparison", function() {
  var examples = [
    {value: 2, isNotLTE: 1},
    {value: 1, isLTE: 2},
    {value: 1, isLTE: 1},
    {value: [0, 1, 3], isNotLTE: 2},
    {value: [0, 1, 3], isNotLTE: 3},
    {value: [0, 1, 3], isLTE: 4},
    {value: [0, [0,1,0], 3], isLTE: [0, [0,2,0], 3]},
    {value: [0, [0,2,0], 3], isNotLTE: [0, [0,1,0], 3]}
  ];
  for (var i=0; i<examples.length; i++) {
    var example = examples[i];
    var value = new Event(example.value);
    if (typeof(example.isLTE) != "undefined") {
      ok(value.lte(new Event(example.isLTE)), JSON.stringify(example));
    } else {
      ok(!value.lte(new Event(example.isNotLTE)), JSON.stringify(example));
    }

  };

});
