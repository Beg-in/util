'use strict';

let test = require('ava').default;
let { ApiError } = require('../error');
let validate = require('./');

let macros = Object.entries({
  'no throw on optional': (t, type) => {
    t.notThrows(() => validate[type]());
  },
  'throw on required': (t, type) => {
    let err = t.throws(() => validate[type].required(), ApiError);
    t.is(err.message, validate[type].message);
  },
  'no throw on valid': (t, type, valid) => {
    t.notThrows(() => validate[type](valid));
  },
  'throw on invalid': (t, type, valid, invalid) => {
    let err = t.throws(() => validate[type](invalid), ApiError);
    t.is(err.message, validate[type].message);
  },
  'true on optional': (t, type) => {
    t.true(validate[type].test());
  },
  'false on required': (t, type) => {
    t.false(validate[type].required.test());
  },
  'true on valid': (t, type, valid) => {
    t.true(validate[type].test(valid));
  },
  'false on invalid': (t, type, valid, invalid) => {
    t.false(validate[type].test(invalid));
  },
}).map(([name, fn]) => Object.assign(fn, { title: (title, type) => `${name} ${type}` }));

test(macros, 'id', '123456', '$');
test(macros, 'nonempty', '1', ' ');
test(macros, 'short', '12', '1');
test(macros, 'email', 'yep@example.com', 'nope');
test(macros, 'password', 'drowssap11', 'nope');
test(macros, 'string', 'foo', false);
test(macros, 'boolean', true, 'nope');
test(macros, 'boolean', false, 'nope');
test(macros, 'number', 5.1, 'nope');
test(macros, 'number', 5, 'nope');
test(macros, 'integer', 5, 5.1);

test('object optional', t => {
  let rules = validate({
    id: validate.id,
    bio: validate.nonempty,
  });
  t.notThrows(() => rules({}));
  t.true(rules.test({}));
  let example = {
    id: '123456',
    bio: '1',
  };
  t.notThrows(() => rules(example));
  t.true(rules.test(example));
  example.id = '1';
  example.bio = '';
  t.throws(() => rules(example));
  t.false(rules.test(example));
});

test('object required', t => {
  let rules = validate({
    id: validate.id.required,
    bio: validate.nonempty.required,
  });
  t.throws(() => rules({}));
  t.false(rules.test({}));
});

test('inner object optional', t => {
  let rules = validate({
    id: validate.id,
    email: validate.email,
    details: validate({
      name: validate.short,
      bio: validate.nonempty,
    }),
  });
  t.notThrows(() => rules({}));
  t.true(rules.test({}));
  let example = {
    id: '123456',
  };
  t.notThrows(() => rules(example));
  t.true(rules.test(example));
  example.email = 'nope';
  t.throws(() => rules(example));
  t.false(rules.test(example));
  example.email = 'name@example.com';
  t.notThrows(() => rules(example));
  t.true(rules.test(example));
  example.details = {};
  t.notThrows(() => rules(example));
  t.true(rules.test(example));
  example.details.name = '';
  t.throws(() => rules(example));
  t.false(rules.test(example));
  example.details.name = 'Name';
  t.notThrows(() => rules(example));
  t.true(rules.test(example));
});

test('inner object required', t => {
  let rules = validate({
    id: validate.id.required,
    email: validate.email.required,
    details: validate({
      fullName: validate.short.required,
      bio: validate.nonempty.required,
    }).required,
  });
  t.throws(() => rules({}));
  t.false(rules.test({}));
  let example = {
    id: '123456',
    email: 'name@example.com',
  };
  t.throws(() => rules(example));
  t.false(rules.test(example));
  example.details = {};
  t.throws(() => rules(example));
  t.false(rules.test(example));
  example.details.fullName = 'Name';
  t.throws(() => rules(example));
  t.false(rules.test(example));
  example.details.bio = '1';
  t.notThrows(() => rules(example));
  t.true(rules.test(example));
});

test('in array', t => {
  const arr = ['a', 'b', 'c'];
  const notIn = 'd';
  const isIn = 'b';
  let rule = validate.in(arr);
  t.throws(() => rule(notIn));
  t.false(rule.test(notIn));
  t.notThrows(() => rule(isIn));
  t.true(rule.test(isIn));
  t.notThrows(() => rule());
  t.throws(() => rule.required());
});
