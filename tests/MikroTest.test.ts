import { MikroTester } from '../src/domain/MikroTester';

import isInput from './data/isInput.json';
import isResponseInput from './data/isResponseInput.json';
import matchesInput from './data/matchesInput.json';
import nakedInput from './data/nakedInput.json';
import statusCodeIsInput from './data/statusCodeIsInput.json';

const mikrotester = new MikroTester();

describe('Success cases', () => {
  test('It should use the fallback validator if no matching validation mechanism is found', async () => {
    const expected = true;

    const result = await mikrotester.runTests(nakedInput as any);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });

  test('It should verify the status code', async () => {
    const expected = true;

    const result = await mikrotester.runTests(statusCodeIsInput as any);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });

  test('It should verify the response as a string', async () => {
    const expected = true;

    const result = await mikrotester.runTests(isResponseInput as any);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });

  test('It should verify that the response is exactly identical', async () => {
    const expected = true;

    const result = await mikrotester.runTests(isInput as any);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });

  test('It should verify that the response matches the JSON schema', async () => {
    const expected = true;

    const result = await mikrotester.runTests(matchesInput as any);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });
});

describe('Failure cases', () => {
  test('It should fail if using an "is" payload for a "matches" assertion', async () => {
    const expected = false;
    // Transform the "is" payload into a malformed "matches" payload
    const input = JSON.parse(JSON.stringify(isInput));
    const assertion = input[0].assertions[0].is;
    input[0].assertions[0].matches = assertion;
    delete input[0].assertions[0].is;

    const result = await mikrotester.runTests(input as any);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });

  test('It should fail if the status code is not correct', async () => {
    const expected = false;
    const input = JSON.parse(JSON.stringify(statusCodeIsInput));
    input[0].assertions[0].statusCodeIs = 500;

    const result = await mikrotester.runTests(input);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });

  test('It should fail if the response is not exactly identical', async () => {
    const expected = false;
    const input = JSON.parse(JSON.stringify(isInput));
    input[0].assertions[0].is.name = 'Boba Fett';

    const result = await mikrotester.runTests(input);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });

  test('It should fail if the response does not match the JSON schema', async () => {
    const expected = false;
    const input = JSON.parse(JSON.stringify(matchesInput));
    input[0].assertions[0].matches.required = ['does not exist'];

    const result = await mikrotester.runTests(input);
    const actual = result[0].success;

    expect(actual).toBe(expected);
  });
});
