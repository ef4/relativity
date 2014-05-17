function Bitfield(initialSizeBytes){
  if (initialSizeBytes instanceof ArrayBuffer) {
    this.buf = new DataView(initialSizeBytes);
  } else {
    this.buf = new DataView(new ArrayBuffer(initialSizeBytes));
  }
  this.byteOffset = 0;
  this.bitOffset = 0;
}

Bitfield.prototype = {

  read: function(numberOfBits) {
    var opSize = numberOfBits + this.bitOffset;
    if (opSize > 32) {
      throw new Error("carry not implemented yet");
    }
    var mask = 0xffffffff >>> (32-numberOfBits);
    var tmp = this.buf.getUint32(this.byteOffset, true);

    tmp = (tmp & (mask << this.bitOffset)) >>> this.bitOffset;
    this.byteOffset += Math.floor(opSize/8);
    this.bitOffset = opSize % 8;
    return tmp;
  },


  write: function(value, numberOfBits) {
    var opSize = numberOfBits + this.bitOffset;
    if (opSize > 32) {
      throw new Error("carry not implemented yet");
    }

    // true means littleEndian
    var tmp = this.buf.getUint32(this.byteOffset, true);

    var mask = 0xffffffff >>> (32-numberOfBits);

    // mask out the bits in the destination.
    tmp &= ~(mask << this.bitOffset);

    // mask out the non-target bits in the source
    value = value & mask;

    // Shift up the source bits
    value = value << this.bitOffset;

    // combine them and write
    this.buf.setUint32(this.byteOffset, tmp | value, true);

    this.byteOffset += Math.floor(opSize/8);
    this.bitOffset = opSize % 8;
  },

  doneWriting: function() {
    this.buf = new DataView(this.buf.buffer, 0, this.byteOffset+(this.bitOffset > 0 ? 1 : 0));
  },
  
  dup: function() {
    var d = new (this.constructor)(this.buf.buffer);
    d.byteOffset = this.byteOffset;
    d.bitOffset = this.bitOffset;
    return d;
  },

  rewind: function() {
    this.byteOffset = 0;
    this.bitOffset = 0;
    return this;
  },

  hex: function() {
    var out = [];
    for (var i=0; i<this.buf.byteLength; i++) {
      out.push(this.buf.getUint8(i).toString(16));
    }
    return out.join('');
  },

  asUnicode: function() {
    return String.fromCharCode.apply(null, Uint16Array(this.buf.buffer, 0, Math.ceil(this.buf.byteLength/2)));
  },
};

Bitfield.prototype.constructor = Bitfield;

Bitfield.fromUnicode = function(str) {
  // Extra four bytes at the end mean we can always read in 32 bit
  // chunks without hitting the end.
  var buf = new ArrayBuffer(str.length*2 + 4);
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return new Bitfield(buf);
};

export default Bitfield;
