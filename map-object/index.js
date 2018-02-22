'use strict';

module.exports = (obj, fn = a => a) => Object.entries(obj).reduce((out, [key, value], i) => {
  out[key] = fn(value, key, i, out, obj);
  return out;
}, {});
