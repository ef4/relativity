import ID from "relativity/id";

function Clock() {
  if (!(this instanceof Clock)) {
    return new Clock;
  }
  this.id = new ID(1);
  this.events = 0;
}

Clock.prototype = {
  fork: function() {
    throw new Error("unimplemented");
  }
}

export default Clock;
