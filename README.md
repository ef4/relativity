*This is an essentially complete implementation of Interval Tree Clocks. But I haven't yet deployed it in anger, and it lacks some niceties, like an efficient binary packed format.*

Interval Tree Clocks for Javascript
===================================

Because any sufficiently advanced web application *is* a distributed
system.

Related reading: [Interval Tree Clocks: A Logical Clock for Dynamic Systems](http://gsd.di.uminho.pt/members/cbm/ps/itc2008.pdf)


Building
--------

    npm install
	broccoli build dist

Testing
-------

    npm install
	broccoli serve
	open http://localhost:4200/tests

On Garbage Collection
---------------------

*This is a proposal in progress, comments on correctness would be appreciated.*

Before we can use ITCs in a web application context, we need a way to garbage collect the ID space that was assigned to clients who never come back. Otherwise our event stamp size can grow without bound. The original ITC paper doesn't contemplate this issue. Conceptually, we want to safely revoke a client's id space so that we can reclaim it without risking causality violations if the client eventually comes back.

A proposed solution: each local clock contains an additional event stamp `B` representing the point in causal time before which no new events are allowed. That is, we will refuse to `join` events that are not causal descendants of `B`. We can can increment `B` over time such that it trails behind by whatever window of time is appropriate for our application. This window represents the longest time a client can remain disconnected and still rejoin the network without having its unshared events declared as "stale" and rejected by other clients.

We actually increment `B` by generating a special event `E`. Within `E`'s stamp we can safely reclaim the old unused id space. Any event not in `E`'s causal past that's not a causal descendant of `B`'s is declared stale. When a client learns `E`, it may discover that it has already accepted some stale events, and therefore needs to take appropriate action.

"Approprtate action" will vary -- the client that originated the events may be able to "rebase" (in the git sense) them onto the newer state. Or just tell the user "sorry, you've been away so long your edits are stale, here's what they were, do you want to redo them?". Other clients that happened to hear about the stale changes before hearing the `B` update can simply choose to undo and/or drop them, so that they remain consistent with the global eventual consensus.

If a sufficiently long window is chosen, it should be quite rare for users to get stuck with stale events. Most of the time, garbage collection will simply lead to smaller ITC stamps with no adverse consequences.

Rules for `B`:
- fork and peek both copy `B` unchanged.
- join:
  - if the incoming event stamp is not a descdant of our local `B`, reject the event because it's too old.
  - if the incoming `B` is not a descendant of our current event stamp, zero out our id because we're stale, and then overwrite our local `B` with the incoming `B`. We're now unable to generate new events, and need to go get a new clock.
  - if the incoming `B` is a equal to our local `B`, nothing to do.
  - if the incoming `B` is a descendant of our local `B`, we should check for any stale events that we've already accepted, deal with them, then replace our `B` with the new `B`.

On Security
------------

It's worth considering the security implications of letting the clients have their own independent ITCs. What can a malicious client achieve by generating arbitrary ITC stamps?

They can insert events into any arbitrary place in the causal history. That is, they can "backdate" an event and make it appear to be in the causal past of other people's events even when it wasn't. This would be a problem if you were trying to rely on the ITC stamps for some kind of security property, such as recording a fact like "User X approves record A as of causal stamp S". So don't do that. If you need this kind of assurance, use real cryptographic signing primitives.

Similarly, if your events make assumptions about their parent states remaining stable, a malicious user can violate those assumptions. For example, if an event says "add ten points to every student in Ravenclaw", an attacker could insert a preceeding event like "move me into Ravenclaw" that changes the intent of the original event. You can avoid this problem if your events are explicit and don't assume anything about their input state. For example, if each event is simply a copy of the new record version(s) that were generated at that time, nobody can later change the intent.

An attacker can also "future date" their own events to guarantee that they will overrule concurrent edits by others by inflating parts of the event space that don't really belong to themselves. The longevity of this attack is limited, because as soon as they share their illegally-inflated stamp, everyone else will inflate their stamps too and causality is restored. 

A malicious client may also generate arbitrarily large ITC stamps. There's nothing in the design to rule out very deep, very big trees. It is not trivial to prevent this -- if you establish a cap, the malicious client can choose to inflate to a size just a little bit smaller than your cap, and wait for other clients to accidentally go over the limit in the normal course of generating new events. 
