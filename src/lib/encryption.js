
function xor(buffer, key) {
  const result = Buffer.alloc(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    result[i] = buffer[i] ^ key[i % key.length];
  }
  return result;
};


module.exports = { xor }
