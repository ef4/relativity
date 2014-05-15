import Stamp from "relativity";

module("Stamp");

test("create", function() {
  ok((new Stamp()) instanceof Stamp, "Created a stamp with new");
  ok(Stamp() instanceof Stamp, "Created a stamp without new");  
});

