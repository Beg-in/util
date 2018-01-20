'use strict';

let { isObject, isArray } = require('../');

let remove = (key, { [key]: removed, ...rest }) => rest;

module.exports = (input, ...sources) => sources.reduce((out, source) => {
  if (isObject(source)) {
    source = Object.keys(source)
  } else if (!isArray(source)) {
    source = [source];
  }
  return source.reduce((all, key) => remove(key, all), out);
}, input);
