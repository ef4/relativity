import Tree from "./tree";
import Bitfield from "./bitfield";

function Event() {
  Tree.apply(this, arguments);
  if (!this.isLeaf() && typeof(this.interior()) === "undefined") {
    throw new Error("Event trees always need interior values");
  }
}

Event.prototype = Object.create(Tree.prototype);
Event.prototype.constructor = Event;

['min', 'max'].forEach(function(name) {
  Event.prototype[name] = function() {
    return this.foldUp(function(left,right,value){
      return Math[name](left, right) + value;
    }, 0);
  };
});

Event.prototype.lift = function(amount) {
  if (this.isLeaf()) {
    return new Event(this.leaf() + amount);
  } else {
    return new Event([this.left(), this.right(), this.interior() + amount]);
  }
};

Event.prototype.sink = function(amount) {
  return this.lift(-1 * amount);
};

Event.prototype.normalize = function() {
  return this.foldUp(function(left,right,value) {
    if (!left) {
      return new Event(value);
    } else {
      if (left.isLeaf() && right.isLeaf() && left.leaf() === right.leaf()) {
        return new Event(left.leaf() + value);
      }
      var m = Math.min(left.min(), right.min());
      return new Event([left.sink(m), right.sink(m), value+m]);
    }
  });
};

Event.prototype.lte = function(other) {
  if (this.isLeaf()) {
    if (other.isLeaf()) {
      return this.leaf() <= other.leaf();
    } else {
      return this.leaf() <= other.interior();
    }
  } else {
    if (other.isLeaf()) {
      return this.interior() <= other.leaf() &&
        this.left().lift(this.interior()).lte(other) &&
        this.right().lift(this.interior()).lte(other);
    } else {
      return this.interior() <= other.interior() &&
        this.left().lift(this.interior()).lte(other.left().lift(other.interior())) &&
        this.right().lift(this.interior()).lte(other.right().lift(other.interior()));
    }
  }
};

Event.prototype.join = function(other) {
  function join(a, b) {
    if (a.isLeaf() && b.isLeaf()) {
      return new Event(Math.max(a.leaf(), b.leaf()));
    }
    if (a.isLeaf()) {
      return join(new Event([0, 0, a.leaf()]), b);
    }
    if (b.isLeaf()) {
      return join(a, new Event([0, 0, b.leaf()]));
    }
    if (a.interior() > b.interior()) {
      return join(b, a);
    }
    return new Event([
      join(a.left(), b.left().lift(b.interior()-a.interior())),
      join(a.right(), b.right().lift(b.interior()-a.interior())),
      a.interior()
    ]);
  }
  return join(this, other).normalize();
};

Event.prototype.pack = function(bitfield) {
  if (!bitfield) {
    var b = new Bitfield(16);
    this.pack(b);
    b.doneWriting();
    return b.asUnicode();
  }

  if (this.isLeaf()){
    bitfield.write(1, 1);
    bitfield.writeInt(this.leaf());
  } else {
    bitfield.write(0, 1);

    var leftZero  = this.left().leaf()  === 0;
    var rightZero = this.right().leaf() === 0;

    if (this.interior() === 0) {
      if (leftZero) {
        bitfield.write(0, 2);
        this.right().pack(bitfield);
      } else if (rightZero) {
        bitfield.write(1, 2);
        this.left().pack(bitfield);
      } else {
        bitfield.write(2, 2);
        this.left().pack(bitfield);
        this.right().pack(bitfield);
      }
    } else {
      if (leftZero) {
        bitfield.write(3, 2); // FIXME combine these into a single write
        bitfield.write(0, 1);
        bitfield.write(0, 1);
        // We differ from the Almeida paper by leaving out an
        // unnecessary bit here. I suspect they typoed by recursing to
        // "enc_e" again rather than just "enc_n".
        bitfield.writeInt(this.interior());
        this.right().pack(bitfield);
      } else if (rightZero) {
        bitfield.write(3, 2);
        bitfield.write(0, 1);
        bitfield.write(1, 1);
        bitfield.writeInt(this.interior());
        this.left().pack(bitfield);
      } else {
        bitfield.write(3, 2);
        bitfield.write(1, 1);
        bitfield.writeInt(this.interior());
        this.left().pack(bitfield);
        this.right().pack(bitfield);
      }
    }
  }
};

Event.unpack = function(bitfield) {
  var left, right, interior;
  if (bitfield.read(1)) {
    return new Event(bitfield.readInt());
  }
  switch (bitfield.read(2)) {
  case 0:
    left = 0;
    right = Event.unpack(bitfield);
    interior = 0;
    break;
  case 1:
    left = Event.unpack(bitfield);
    right = 0;
    interior = 0;
    break;
  case 2:
    left = Event.unpack(bitfield);
    right = Event.unpack(bitfield);
    interior = 0;
    break;
  case 3:
    if (bitfield.read(1)) {
      interior = bitfield.readInt();
      left = Event.unpack(bitfield);
      right = Event.unpack(bitfield);
    } else if (bitfield.read(1)) {
      interior = bitfield.readInt();
      left = Event.unpack(bitfield);
      right = 0;
    } else {
      interior = bitfield.readInt();
      right = Event.unpack(bitfield);
      left = 0 ;
    }
  }
  return new Event([left, right, interior]);
};

export default Event;
