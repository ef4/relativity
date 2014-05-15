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
    throw new Error("unimplemented");
  },
  
  flatten: function() {
    return [this._id.flatten(), this._event.flatten()];
  },

  toString: function() {
    return JSON.stringify(this.flatten());
  }
};

export default Stamp;
