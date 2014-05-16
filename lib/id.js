import Tree from "relativity/tree";

function ID() {
  Tree.apply(this, arguments);
}

ID.prototype = Object.create(Tree.prototype);
ID.prototype.constructor = ID;
  
ID.prototype.split = function() {
  var inner;
  if (this.leaf() === 0) {
    return [new ID(0), new ID(0)];
  }
  if (this.leaf() === 1) {
    return [new ID([1,0]), new ID([0,1])];
  }
  if (this.left().leaf() === 0) {
    inner = this.right().split();
    return [new ID([0, inner[0]]), new ID([0, inner[1]])];
  }
  if (this.right().leaf() === 0) {
    inner = this.left().split();
    return [new ID([inner[0], 0]), new ID([inner[1], 0])];
  }
  return [new ID([this.left(), 0]), new ID([0, this.right()])];
};

ID.prototype.sum = function(other) {
  return this.zip(other).map(function(pair) { return pair[0] || pair[1]; }).normalize();
};

ID.prototype.normalize = function() {
  return this.foldUp(function(left,right,value) {
    if (!left) {
      return new ID(value);
    }
    if (left.isLeaf() && right.isLeaf() && left.leaf() === right.leaf()) {
      return new ID(left.leaf());
    }
    return new ID([left,right]);
  });
};

ID.prototype.pack = function(bitfield) {
  if (this.isLeaf()){
    bitfield.write(0, 2);
    bitfield.write(this.leaf(), 1);
  } else if (this.left().leaf() === 0) {
    bitfield.write(1, 2);
    this.right().pack(bitfield);
  } else if (this.right().leaf() === 0) {
    bitfield.write(2, 2);
    this.left().pack(bitfield);
  } else {
    bitfield.write(3, 2);
    this.left().pack(bitfield);
    this.right().pack(bitfield);
  }
};

ID.unpack = function(bitfield) {
  switch (bitfield.read(2)) {
  case 0:
    return new ID(bitfield.read(1));
  case 1:
    return new ID([0, ID.unpack(bitfield)]);
  case 2:
    return new ID([ID.unpack(bitfield), 0]);
  case 3:
    return new ID([ID.unpack(bitfield), ID.unpack(bitfield)]);
  }
};

export default ID;
