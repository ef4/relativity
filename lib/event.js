import Tree from "relativity/tree";
var slice = [].slice;

function Event() {
  Tree.apply(this, arguments);
}

Event.prototype = Object.create(Tree.prototype);
Event.prototype.constructor = Event;

Event.prototype.min = function() {
  return this.reduce(function(left,right,interior){
    return Math.min(left, right) + interior;
  });
}

Event.prototype.lift = function(amount) {
  if (this.isLeaf()) {
    return new Event(this.leaf() + amount);
  } else {
    return new Event([this.left(), this.right(), this.interior() + amount]);
  }
}

Event.prototype.sink = function(amount) {
  return this.lift(-1 * amount);
}

Event.prototype.normalize = function() {
  return this.reduce(function(left,right,interior) {
    if (left.isLeaf() && right.isLeaf() && left.leaf() === right.leaf()) {
      return new Event(left.leaf() + interior);
    }
    var m = Math.min(left.min(), right.min());
    return new Event([left.sink(m), right.sink(m), interior+m]);
  }, function(leafNode){return leafNode});
}

Event.prototype.lte = function(other) {
  console.log("comparing", this.flatten(), other.flatten());
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
	this.right().lift(this.interior()).lte(other)
    } else {
      return this.interior() <= other.interior() &&
	this.left().lift(this.interior()).lte(other.left().lift(other.interior())) &&
	this.right().lift(this.interior()).lte(other.right().lift(other.interior()))
    }
  }
}

export default Event;
