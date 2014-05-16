import ID from "relativity/id";
import Event from "relativity/event";

function Stamp(id, event) {
  if (!(this instanceof Stamp)) {
    return new Stamp(id, event);
  }
  this._id = id || new ID(1);
  this._event = event || new Event(0);
}

Stamp.prototype = {
  lte: function(other) {
    return this._event.lte(other._event);
  },
  
  fork: function() {
    var halves = this._id.split();
    return [new Stamp(halves[0], this._event), new Stamp(halves[1], this._event)];
  },

  join: function(other) {
    return new Stamp(this._id.sum(other._id), this._event.join(other._event));
  },

  event: function() {
    if (this._id.leaf() === 0) {
      throw new Error("cannot register new events on an anonymous stamp");
    }
    var filled = fill(this._id, this._event);
    if (!filled.eq(this._event)) {
      return new Stamp(this._id, filled);
    }
    return new Stamp(this._id, grow(this._id, this._event).event);
  },
  
  flatten: function() {
    return [this._id.flatten(), this._event.flatten()];
  },

  toString: function() {
    return JSON.stringify(this.flatten());
  }
};

export default Stamp;

function fill(id, event) {
  var e;
  if (id.isLeaf()){
    if (id.leaf() === 0) {
      return event;
    }
    return new Event(event.max());
  }
  if (event.isLeaf()) {
    return event;
  } 
  if (id.left().leaf() === 1) {
    e = fill(id.right(), event.right());
    return new Event([Math.max(event.left().max(), e.min()), e, event.interior()]).normalize();
  }
  if (id.right().leaf() === 1) {
    e = fill(id.left(), event.left());
    return new Event([e, Math.max(event.right().max(), e.min()), event.interior()]).normalize();
  }
  return new Event([fill(id.left(), event.left()), fill(id.right(), event.right()), event.interior()]).normalize();
}

function grow(id, event) {
  if (!event.isLeaf()) {
    return growCheaperSide(id, event);
  }

  if (id.leaf() === 1) {
    return { event: new Event(event.leaf() + 1), cost: 0 };
  }

  var result = grow(id, new Event([0, 0, event.leaf()]));
  // this is a fairly arbitrary constant that just needs to be
  // practically larger than the largest tree depth.
  result.cost += 10000;
  return result;
}

function growCheaperSide(id, event) {
  var leftGrown, rightGrown;
  if (id.isLeaf() || (id.left().leaf===0 && id.right().leaf()===0)) {
    throw new Error("this case should never happen, given normalized inputs");
  }
  if (id.left().leaf() === 0) {
    return growRight(id, event);
  }
  if (id.right().leaf() === 0) {
    return growLeft(id, event);
  }
  leftGrown = growLeft(id, event);
  rightGrown = growRight(id, event);
  return leftGrown.cost < rightGrown.cost ? leftGrown : rightGrown;
}

function growLeft(id, event) {
  var grown = grow(id.left(), event.left());
  return {
    event: new Event([grown.event, event.right(), event.interior()]),
    cost: grown.cost + 1
  };
}

function growRight(id, event) {
  var grown = grow(id.right(), event.right());
  return {
    event: new Event([event.left(), grown.event, event.interior()]),
    cost: grown.cost + 1
  };
}
