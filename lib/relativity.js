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
    var filled = fill(this._id, this._event);
    if (!filled.eq(this._event)) {
      return new Stamp(this._id, filled);
    } else {
      return new Stamp(this._id, grow(this).event);
    }
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
    } else {
      return new Event(event.max());
    }
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

function grow() {
  throw new Error("unimplemented");  
}
