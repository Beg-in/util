'use strict';

let { isDate, isObject, isArray, isRegex } = require('../');

function assignDeep(target, ...sources) {
  if (sources.length < 1) {
    if (isDate(target)) {
      return new Date(target.getTime());
    }
    if (!isRegex(target) && isObject(target)) {
      return Object.entries(target).reduce((output, [key, value]) => {
        output[key] = assignDeep(value);
        return output;
      }, {});
    }
    if (isArray(target)) {
      return target.map(value => assignDeep(value));
    }
    return target;
  }
  return sources.reduce((output, source) => {
    if (isArray(source) && isArray(output)) {
      source.forEach(value => {
        if (!output.includes(value)) {
          output.push(assignDeep(value));
        }
      });
      return output;
    }
    if (!isRegex(source) && !isDate(source) && isObject(source) && isObject(output)) {
      Object.entries(source).forEach(([key, value]) => {
        output[key] = assignDeep(target[key], value);
      });
      return output;
    }
    return assignDeep(source);
  }, assignDeep(target));
}

module.exports = assignDeep;

