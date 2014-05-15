import Stamp from "relativity";

module("Basic Sanity Checks");

test("can create stamp", function() {
  ok((new Stamp) instanceof Stamp, "Created a clock with new");
  ok(Stamp() instanceof Stamp, "Created a clock without new");  
});

