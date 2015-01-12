/* global describe, it */
import Stamp from "relativity";
import { Event, ID } from "relativity";
import chai from "chai";
var expect = chai.expect;

describe("Stamp", function() {

  it("can be created", function() {
    expect(new Stamp()).to.be.instanceof(Stamp);
    expect(Stamp()).to.be.instanceof(Stamp);
  });


  it("generates events", function() {
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
      expect(s.event().flatten()).to.deep.equal([example.withId, example.to]);
    });
  });

  it("rejects anonymous events", function() {
    expect(function() {
      new Stamp(new ID(0), new Event([1, 0, 0])).event();
    }).throws("cannot register new events on an anonymous stamp");
  });
});
