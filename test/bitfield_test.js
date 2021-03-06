/* global describe, it */
import { Bitfield } from "relativity";
import chai from "chai";
var expect = chai.expect;

describe("Bitfield", function() {

  it("can write", function() {
    var b = new Bitfield(16);
    b.write(1, 3);
    expect(b.byteOffset).to.equal(0);
    expect(b.bitOffset).to.equal(3);
    b.write(1, 3);
    expect(b.byteOffset).to.equal(0);
    expect(b.bitOffset).to.equal(6);
    expect(b.buf.getUint32(0, true)).to.equal(9);
    b.write(1, 3);
    expect(b.byteOffset).to.equal(1);
    expect(b.bitOffset).to.equal(1);
    expect(b.buf.getUint32(0, true)).to.equal(73);

    var c = b.dup().rewind();
    expect(c.read(3)).to.equal(1);
    expect(c.read(3)).to.equal(1);
    expect(c.read(3)).to.equal(1);
  });

  it("can encode variable length integers", function() {
    var b = new Bitfield(256);
    var samples = [0, 1, 7, 8, 9, 15, 16, 17, 30, 32, 33, 63, 64, 65, 1000, 2000, 3000, 4000];

    for (var i=0; i<samples.length; i++) {
      b.writeInt(samples[i]);
    }

    var c = b.dup().rewind();
    for (i=0; i<samples.length; i++) {
      expect(c.readInt()).to.equal(samples[i]);
    }
  });

});
