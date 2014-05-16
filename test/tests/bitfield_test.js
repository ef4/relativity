import { Bitfield } from "relativity";

QUnit.module("Bitfield");

test("write", function() {
  var b = new Bitfield(16);
  b.write(1, 3);
  strictEqual(b.byteOffset, 0);
  strictEqual(b.bitOffset, 3);
  b.write(1, 3);
  strictEqual(b.byteOffset, 0);
  strictEqual(b.bitOffset, 6);
  strictEqual(b.buf.getUint32(0, true), 9);
  b.write(1, 3);
  strictEqual(b.byteOffset, 1);
  strictEqual(b.bitOffset, 1);
  strictEqual(b.buf.getUint32(0, true), 73);

  var c = b.dup().rewind();
  strictEqual(c.read(3), 1);
  strictEqual(c.read(3), 1);
  strictEqual(c.read(3), 1);
});

