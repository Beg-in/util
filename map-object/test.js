'use strict';

let test = require('ava').default;
let mapObject = require('./');

const INPUT = {
  one: 1,
  two: 2,
  three: 3,
};

test('new object', t => {
  t.not(mapObject(INPUT, value => value), INPUT);
});

test('empty', t => {
  t.deepEqual(mapObject({}, value => value), {});
});

test('default', t => {
  t.deepEqual(mapObject(INPUT), INPUT);
});

test('values', t => {
  t.deepEqual(mapObject(INPUT, value => ++value), {
    one: 2,
    two: 3,
    three: 4,
  });
});

test('keys', t => {
  t.deepEqual(mapObject(INPUT, (a, key) => key), {
    one: 'one',
    two: 'two',
    three: 'three',
  });
});

test('indexes', t => {
  t.deepEqual(mapObject(INPUT, (a, key, i) => i), {
    one: 0,
    two: 1,
    three: 2,
  });
});

test('reduce', t => {
  let count = 0;
  mapObject(INPUT, (value, key, i, out) => {
    switch (i) {
      case 0:
        t.deepEqual(out, {});
        count++;
        break;
      case 1:
        t.deepEqual(out, { one: 1 });
        t.is(count, 1);
        count++;
        break;
      case 2:
        t.deepEqual(out, { one: 1, two: 2 });
        t.is(count, 2);
        count++;
        break;
      default:
        t.fail();
    }
    return value;
  });
  t.is(count, 3);
});

test('input', t => {
  t.deepEqual(mapObject(INPUT, (value, key, i, out, input) => input), {
    one: INPUT,
    two: INPUT,
    three: INPUT,
  });
});
