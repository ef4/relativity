/* global describe, it */
import Stamp from "relativity";
import chai from "chai";
var expect = chai.expect;

describe("Acceptance Tests", function(){

  it("completes sample run from Almeida, et al", function() {
    var tmp, a, b, c, d, e, f, g, h, i, j, k, l, m, n;

    a = new Stamp();  //
    tmp = a.fork();   //
    b = tmp[0];       //                       -----o--------o-----------
    c = tmp[1];       //                      /     F        I           `
    d = b.event();    //                     /                            `
    e = c.event();    //       ----o--------o                              o--------o
    tmp = d.fork();   //      /    B        D`                            /M        N
    f = tmp[0];       //     /                `                          /
    g = tmp[1];       //    o                  -----o-----     -----o----
    h = e.event();    //    A`                      G     `   /     K
    i = f.event();    //      `                            ` /
    j = g.join(h);    //       `                            o
    tmp = j.fork();   //        `                          /J`
    k = tmp[0];       //         `                        /   `
    l = tmp[1];       //          -o--------o-------o-----     -----o
    m = i.join(k);    //           C        E       H               L
    n = m.event();    //

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
