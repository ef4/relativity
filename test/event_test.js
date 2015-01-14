/* global describe, it */
import { Event, Bitfield } from "relativity";
import chai from "chai";
var expect = chai.expect;

describe("Event", function() {

  it("can be created", function(){
    var e = new Event([1, [2, 3, 4], 5]);
    expect(e.interior()).to.equal(5);
    expect(e.right().left().leaf()).to.equal(2);
    expect(e.right().interior()).to.equal(4);
  });

  it("supports min", function() {
    var examples = [
      {from: 0, to: 0},
      {from: [1, 2, 7], to: 8}
    ];
    for (var i=0; i<examples.length; i++) {
      expect(new Event(examples[i].from).min()).to.deep.equal(examples[i].to);
    }
  });

  it("can normalize", function() {
    var examples = [
      {from: [1, 3, 7], to: [0, 2, 8]},
      {from: [3, 3, 7], to: 10},
      {from: [[3, 3, 7], 10, 1], to: 11}
    ];
    for (var i=0; i<examples.length; i++) {
      expect((new Event(examples[i].from)).normalize().flatten())
        .to.deep.equal(examples[i].to);
    }

  });

  it("can be compared", function() {
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
      if (typeof(example.isLTE) !== "undefined") {
        expect(value.lte(new Event(example.isLTE)), JSON.stringify(example))
          .to.be.true();
      } else {
        expect(value.lte(new Event(example.isNotLTE)), JSON.stringify(example))
          .to.be.false();
      }
    }
  });


  it("can be joined", function() {
    var examples = [
      {a: 1, b: 2, joinsTo: 2},
      {a: [1, 0, 1], b: [0, 1, 1], joinsTo: 2},
      {a: [2, 0, 1], b: [0, 1, 1], joinsTo: [1, 0, 2]},
      {a: [[2, 0, 1], 0, 3], b: [[0, 1, 1], 0, 3], joinsTo: [[1, 0, 2], 0, 3]}
    ];
    for (var i=0; i<examples.length; i++) {
      var e = examples[i];
      expect((new Event(e.a)).join(new Event(e.b)).flatten()).to.deep.equal(e.joinsTo);
    }
  });

  it("can be packed & unpacked", function() {
    var examples = [
      { event: [ 0, 7, 0] },
      { event: [ 0, [1, 0, 0], 0] },
      { event: [ [1, 0, 0], 0, 0] },
      { event: [ [1, 0, 0], [0, 1, 0], 0] },
      { event: [ 0, [1, 0, 0], 100] },
      { event: [ [1, 0, 0], 0, 100] },
      { event: [ [1, 0, 0], [0, 1, 0], 100] }
    ];
    for (var i=0; i<examples.length; i++) {
      var e = new Event(examples[i].event);
      var bitfield = new Bitfield(256);
      e.pack(bitfield);
      bitfield = bitfield.dup().rewind();
      expect(Event.unpack(bitfield).flatten()).to.deep.equal(examples[i].event);
    }
  });


});
