'use strict';

let test = require('ava').default;
let assignDeep = require('./');

test('atomic', t => {
  let input = { foo: {} };
  t.not(assignDeep(input), input);
  t.not(assignDeep(input).foo, input.foo);
});

test('merge empty', t => {
  t.deepEqual(assignDeep({}, {}), {});
});

test('merge flat', t => {
  let out = { foo: 'baz' };
  t.deepEqual(assignDeep({ foo: 'bar' }, out), out);
});

test('merge deep', t => {
  let out = { foo: { bar: 'bang' } };
  t.deepEqual(assignDeep({ foo: { bar: 'baz' } }, out), out);
});

test('merge deep extra args', t => {
  let out = { foo: { bar: 'bang' } };
  t.deepEqual(assignDeep({ foo: { bar: 'baz' } }, { foo: 'nope' }, out), out);
});


