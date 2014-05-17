import { ID, Bitfield} from "relativity";

QUnit.module("ID");

function isDisjoint(idA, idB) {
  return idA.zip(idB).foldUp(function(left, right, value) {
    return left && right && !(value[0] && value[1]);
  }, true);
}

test("build leaf ID", function() {
  var l = new ID(1);
  strictEqual(l.leaf(), 1);
  ok(l.isLeaf(), "is leaf");
  strictEqual(l.left(), undefined);  
});

test("build interior ID", function() {
  var l = new ID([1,0]);
  ok(!l.isLeaf(), "not isLeaf");
  strictEqual(l.leaf(), undefined);
  if (l.left() instanceof ID) {
    strictEqual(l.left().leaf(), 1);
  } else {
    ok(false, "left not an ID");
  }
});


test("splits into disjoint pieces", function() {
  var i, ids = [new ID(1)].concat(new ID(1).split());
  expect(ids.length);
  
  for (i=0; i<ids.length; i++) {
    var pieces = ids[i].split();
    ok(isDisjoint(pieces[0], pieces[1]), "not disjoint: " + pieces[0], + ", " + pieces[1]);
  }

});

test("disjointness tester works", function() {
  ok(!isDisjoint(new ID(1), new ID(1)));
  ok(isDisjoint(new ID(1), new ID(0)));
  ok(!isDisjoint(new ID([1,0]), new ID([[1,0],0])));
  ok(isDisjoint(new ID([1,0]), new ID([[0,0],0])));
});

test("normalization", function() {
  var cases = [
    {from: 0, to: 0},
    {from: 1, to: 1},
    {from: [0,1], to: [0,1]},
    {from: [0,0], to: 0},
    {from: [1,[0,0]], to: [1,0]},
    {from: [1,[1,1]], to: 1}
  ];
  for (var i=0; i<cases.length; i++) {
    deepEqual(new ID(cases[i].from).normalize().flatten(), cases[i].to);
  }
});

test("sum", function() {
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
    deepEqual(new ID(cases[i].add).sum(new ID(cases[i].to)).flatten(), cases[i].get);
  }
});

test("pack", function() {
  var i = new ID([[0,1], [[0,1], 0]]);
  var b = new Bitfield(8);
  i.pack(b);
  b.doneWriting();
  strictEqual(b.hex(), '4723');
  strictEqual(b.asUnicode(), "⍇");
});

test("unpack", function() {
  var b = new Bitfield(8);
  b.write(0x2347, 16);
  b.rewind();
  var i = ID.unpack(b);
  deepEqual(i.flatten(), [[0,1], [[0,1], 0]]);

  i = ID.unpack(Bitfield.fromUnicode("⍇"));
  deepEqual(i.flatten(), [[0,1], [[0,1], 0]]);  
  
});


