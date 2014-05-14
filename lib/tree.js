// Clocks are made of an (id, event) pair. Both id and event are
// binary trees. This is the base implementation of both parts.


// Constructor arguments:
//
// A two-element list [left, right] constructs an interior node,
// recursing down over both pieces.
//
// A three-element list [left, right, interiorValue] constructs an interior
// node that also has a value attached.
//
// An object with the property "leaf" (`{leaf: value}`), will always
// construct a leaf node with the value of that property. This lets
// you stick a two- or three- element list into the value of a leaf.
//
// Anything else constructs a leaf with the given value.
function Tree(arg) {
  if (arg.leaf) {
    this._leaf = arg.leaf;
  } else if (Array.isArray(arg) && (arg.length === 2 || arg.length === 3)) {

    if (arg[0] instanceof Tree) {
      this._left = arg[0];
    } else {
      this._left = new (this.constructor)(arg[0]);
    }

    if (arg[1] instanceof Tree) {
      this._right = arg[1];
    } else {
      this._right = new (this.constructor)(arg[1]);
    }

    if (arg.length === 3) {
      this._interior = arg[2];
    }
  } else {
    this._leaf = arg;
  }
}

Tree.prototype = {
  // These accessors are not just bloat -- they (will) let us swap in
  // tightly packed, optimized tree representations without changing
  // the external api.
  leaf: function() {return this._leaf },
  left: function() { return this._left },
  right: function() { return this._right },
  interior: function() { return this._interior },

  isLeaf: function() {
    return typeof(this._leaf) != "undefined";
  },

  flatten: function() {
    if (this.isLeaf()){
      return this.leaf();
    } else {
      var output = [this.left().flatten(), this.right().flatten()];
      if (typeof(this._interior) != "undefined") {
	output.push(this.interior());
      }
      return output;
    }
  },

  toString: function() {
    return JSON.stringify(this.flatten());
  },

  map: function(func) {
    if (this.isLeaf()) {
      return new (this.constructor)(func(this.leaf()));
    } else {
      return new (this.constructor)([this.left().map(func), this.right().map(func), this.interior()]);
    }
  },

  reduce: function(func, leafFunc) {
    if (this.isLeaf()) {
      if (leafFunc) {
	return leafFunc.apply(this, [this]);
      } else {
	return this.leaf();
      }
    } else {
      return func(this.left().reduce(func, leafFunc), this.right().reduce(func, leafFunc), this.interior());
    }
  },

  zip: function(tree, splitter) {
    if (splitter === undefined) {
      splitter = function(leaf) {
	return new (this.constructor)([leaf, leaf]);
      }
    }
    if (this.isLeaf() && tree.isLeaf()) {
      return new (this.constructor)({leaf: [this.leaf(), tree.leaf()]});
    }

    if (this.isLeaf()) {
      return splitter.apply(this, [this.leaf()]).zip(tree, splitter);
    }

    if (tree.isLeaf()) {
      return this.zip(splitter.apply(this, [tree.leaf()]), splitter)
    }

    return new (this.constructor)([
      this.left().zip(tree.left(), splitter),
      this.right().zip(tree.right(), splitter),
      [this.interior(), tree.interior()]
    ])
  }
}

export default Tree;
