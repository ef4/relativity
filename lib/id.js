import Tree from "relativity/tree";

function ID() {
  Tree.apply(this, arguments);
}

ID.prototype = Object.create(Tree.prototype);
ID.prototype.constructor = ID;
  
ID.prototype.split = function() {
    var inner;
    if (this.leaf() === 0) {
      return [new ID(0), new ID(0)]
    }
    if (this.leaf() === 1) {
      return [new ID(1,0), new ID(0,1)];
    }
    if (this.left() === 0) {
      inner = this.right().split();
      return [new ID(0, inner[0]), new ID(0, inner[1])];
    }
    if (this.right() === 0) {
      inner = this.left().split();
      return [new ID(inner[0], 0), new ID(inner[1], 0)];
    }
    return [new ID(this.left(), 0), new ID(0, this.right())];
}


export default ID;
