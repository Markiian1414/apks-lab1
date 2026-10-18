const { add } = require('../src/math');

test('BasicAddition adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});
