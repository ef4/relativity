/* global describe, it */
import chai from "chai";
var expect = chai.expect;
import { ID, Bitfield} from "relativity";

describe("ID", function() {

  chai.Assertion.addMethod('isDisjointFrom', function(idB) {
    var idA = this._obj;

    new chai.Assertion(idA).to.be.instanceof(ID);
    new chai.Assertion(idB).to.be.instanceof(ID);
    this.assert(
      idA.zip(idB).foldUp(function(left, right, value) {
        return left && right && !(value[0] && value[1]);
      }, true),
      "expected #{idA} to be disjoint from #{idB}"
    );
  });

  it("builds leaf ID", function() {
    var l = new ID(1);
    expect(l.leaf()).to.equal(1);
    expect(l.isLeaf(), "is leaf").to.be.true();
    expect(l.left()).to.be.undefined();
  });

  it("builds interior ID", function() {
    var l = new ID([1,0]);
    expect(l.isLeaf(), "not isLeaf").to.be.false();
    expect(l.leaf()).to.be.undefined();
    expect(l.left()).instanceof(ID);
    expect(l.left().leaf()).to.equal(1);
  });


  it("splits into disjoint pieces", function() {
    var i, ids = [new ID(1)].concat(new ID(1).split());
    expect(ids.length);

    for (i=0; i<ids.length; i++) {
      var pieces = ids[i].split();
      expect(pieces[0]).isDisjointFrom(pieces[1]);
    }
  });

  it("can use disjointness tester", function() {
    expect(new ID(1)).not.isDisjointFrom(new ID(1));
    expect(new ID(1)).isDisjointFrom(new ID(0));
    expect(new ID([1,0])).not.isDisjointFrom(new ID([[1,0],0]));
    expect(new ID([1,0])).isDisjointFrom(new ID([[0,0],0]));
  });

  it("supports normalization", function() {
    var cases = [
      {from: 0, to: 0},
      {from: 1, to: 1},
      {from: [0,1], to: [0,1]},
      {from: [0,0], to: 0},
      {from: [1,[0,0]], to: [1,0]},
      {from: [1,[1,1]], to: 1}
    ];
    for (var i=0; i<cases.length; i++) {
      expect(new ID(cases[i].from).normalize().flatten()).to.deep.equal(cases[i].to);
    }
  });

  it("supports sum", function() {
    var cases = [
      {add: 0, to: 0, get: 0},
      {add: 1, to: 1, get: 1},
      {add: 0, to: 1, get: 1},
      {add: [1,0], to: [0, 1], get: 1},
      {add: [0,[0,[0,1]]], to: [[[1,0],0],0], get: [[[1,0],0],[0, [0,1]]]},
      {add: [1,[0,[0,1]]], to: [[[1,0],0],0], get: [1,[0, [0,1]]]},
      {add: [1,[0,[0,1]]], to: [1,[0,[1,0]]], get: [1,[0, 1]]}
    ];
    for (var i=0; i<cases.length; i++) {
      expect(new ID(cases[i].add).sum(new ID(cases[i].to)).flatten())
        .to.deep.equal(cases[i].get);
    }
  });


  it("can be packed & unpacked", function() {
    var examples = [
      { id: 0 },
      { id: 1 },
      { id: [ 0, 1 ] },
      { id: [ 1, 0 ] },
      { id: [ 1, 1 ] },
      { id: [ 1, [ 0, 1] ] },
      { id: [[1, 0], 0 ] }
    ];
    for (var i=0; i<examples.length; i++) {
      var id = new ID(examples[i].id);
      var bitfield = new Bitfield(256);
      id.pack(bitfield);
      bitfield = bitfield.dup().rewind();
      expect(ID.unpack(bitfield).flatten()).to.deep.equal(examples[i].id);
    }
  });

});
