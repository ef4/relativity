/* global describe, it */
import Stamp from "relativity";
import chai from "chai";
var expect = chai.expect;

describe("Acceptance Tests", function(){

  it("completes sample run from Almeida, et al", function() {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n;

    a = new Stamp();    //
    [b,c] = a.fork();   //
    d = b.event();      //                       -----o--------o-----------
    e = c.event();      //                      /     F        I           `
    [f,g] = d.fork();   //                     /                            `
    h = e.event();      //       ----o--------o                              o--------o
    i = f.event();      //      /    B        D`                            /M        N
    j = g.join(h);      //     /                `                          /
    [k,l] = j.fork();   //    o                  -----o-----     -----o----
    m = i.join(k);      //    A`                      G     `   /     K
    n = m.event();      //      `                            ` /
                        //       `                            o
                        //        `                          /J`
                        //         `                        /   `
                        //          -o--------o-------o-----     -----o
                        //           C        E       H               L
                        //

    expect(n.flatten()).to.deep.equal([[1,0], 2]);
    expect(l.flatten()).to.deep.equal([[0,1], [0, 1, 1]]);
    expect(a.lte(d) ,"a in d's causal history").to.be.true();
    expect(d.lte(a), "d not in a's causal history").to.be.false();
    expect(d.lte(e), "d not in e's causal history").to.be.false();
    expect(e.lte(d), "e not in d's causal history").to.be.false();
    expect(e.lte(j), "e in j's causal history").to.be.true();
    expect(d.lte(j), "d in j's causal history").to.be.true();
  });


  it("anonymous stamps can be joined and will sort correctly", function() {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n;

    a = new Stamp();
    [b,c] = a.fork();
    d = b.event();
    e = c.event();
    [f,g] = d.fork();
    h = e.event();
    i = f.event();
    j = g.join(h);
    [k,l] = j.fork();
    m = i.join(k);
    n = m.event();

    var virtualJ = g.peek().join(h.peek());
    expect(virtualJ.lte(j)).to.be.true();
    expect(j.lte(virtualJ)).to.be.true();

    var intermediate = b.peek().join(h.peek());
    expect(a.lte(intermediate)).to.be.true();
    expect(b.lte(intermediate)).to.be.true();
    expect(c.lte(intermediate)).to.be.true();
    expect(e.lte(intermediate)).to.be.true();
    expect(h.lte(intermediate)).to.be.true();

    expect(d.lte(intermediate)).to.be.false();
    expect(f.lte(intermediate)).to.be.false();
    expect(g.lte(intermediate)).to.be.false();
    expect(i.lte(intermediate)).to.be.false();
    expect(j.lte(intermediate)).to.be.false();
  });

});
