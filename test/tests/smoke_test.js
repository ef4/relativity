import Clock from "relativity";

module("Basic Sanity Checks");

test("can create clock", function() {
  ok((new Clock) instanceof Clock, "Created a clock with new");
  ok(Clock() instanceof Clock, "Created a clock without new");  
});

