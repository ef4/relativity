import ID from "relativity/id";

module("ID invariants");

function isDisjoint(idA, idB) {
  return idA.zip(idB).map(function(leaves) {
    return !(leaves[0] && leaves[1]);
  }).reduce(function(a, b) { return a && b })
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
