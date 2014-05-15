import ID from "relativity/id";
import Event from "relativity/event";

function Stamp() {
  if (!(this instanceof Stamp)) {
    return new Stamp();
  }
  this._id = new ID(1);
  this._event = new Event(0);
}

Stamp.prototype = {
  lte: function(other) {
    
  },
  
  fork: function() {
    throw new Error("unimplemented");
  }
};

export default Stamp;
