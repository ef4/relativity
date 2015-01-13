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
});
