import Tree from "relativity/tree";

function Event() {
  Tree.apply(this, arguments);
}

Event.prototype = Object.create(Tree.prototype);
Event.prototype.constructor = Event;

Event.prototype.min = function() {
  return this.foldUp(function(left,right,value){
    return Math.min(left, right) + value;
  }, 0);
};

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

export default Event;
