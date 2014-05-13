// By default we assume any two-element list is intended to represent
// an interior node, so that you can construct arbitrary trees like:
// `new Tree([1,[2,3]])`. And anything else is a leaf, like `new
// Tree("hello")`. But you can explicitly make a leaf containing a
// two-element list like `new Tree({leaf: [1, [2,3]]})`.
function Tree(arg) {
  if (arg.leaf) {
    this._leaf = arg.leaf;
  } else if (Array.isArray(arg) && arg.length === 2) {

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
  } else {
    this._leaf = arg;
  }
}

Tree.prototype = {  
  leaf: function() {return this._leaf },
  left: function() { return this._left },
  right: function() { return this._right },  

  isLeaf: function() {
    return typeof(this._leaf) != "undefined";
  },
  
  flatten: function() {
    if (this.isLeaf()){
      return this.leaf();
    } else {
      return [this.left().flatten(), this.right().flatten()];
    }
  },

  toString: function() {
    return JSON.stringify(this.flatten());
  },

  map: function(func) {
    if (this.isLeaf()) {
      return new (this.constructor)(func(this.leaf()));
    } else {
      return new (this.constructor)([this.left().map(func), this.right().map(func)]);
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
      return func(this.left().reduce(func, leafFunc), this.right().reduce(func, leafFunc));
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
      this.right().zip(tree.right(), splitter)
    ])
  }
}

export default Tree;
