
/**
 * djb2 string hash
 * @param {string} str
 * @returns {number} 32‑bit hash
 */
function hashDJB2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    // (hash * 33) + charCode
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    // Force to 32‑bit integer
    hash = hash & 0xFFFFFFFF;
  }
  // Convert to unsigned 32‑bit integer
  return hash >>> 0;
}

module.exports = {
  hashDJB2
}
