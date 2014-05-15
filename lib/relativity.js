import ID from "relativity/id";

function Stamp() {
  if (!(this instanceof Stamp)) {
    return new Stamp;
  }
  this.id = new ID(1);
  this.events = 0;
}

Stamp.prototype = {
  fork: function() {
    throw new Error("unimplemented");
  }
}

export default Stamp;
