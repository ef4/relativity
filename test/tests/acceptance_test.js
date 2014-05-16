import Stamp from "relativity";

module("Acceptance Tests");

test("sample run from Almeida, et al", function() {
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
                      
  deepEqual(n.flatten(), [[1,0], 2]);
  deepEqual(l.flatten(), [[0,1], [0, 1, 1]]);
  ok(a.lte(d), "a in d's causal history");
  ok(!(d.lte(a)), "d not in a's causal history");
  ok(!(d.lte(e)), "d not in e's causal history");
  ok(!(e.lte(d)), "e not in d's causal history");
  ok(e.lte(j), "e in j's causal history");
  ok(d.lte(j), "d in j's causal history");  
});                                                     
