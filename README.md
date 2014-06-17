*This is an essentially complete implementation of Interval Tree Clocks. But I haven't yet deployed it in anger, and it lacks some niceties, like an efficient binary packed format.*

Interval Tree Clocks for Javascript
===================================

Because any sufficiently advanced web application *is* a distributed
system.

Building
--------

    npm install
	broccoli build dist

Testing
-------

    npm install
	broccoli serve
	open http://localhost:4200/tests
