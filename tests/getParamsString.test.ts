import { getParamsString } from '../src/frameworks/getParamsString';

describe('Success cases', () => {
  test('It should return an array of keys and values from a single item input', async () => {
    const expected = ['foo', 'bar'];

    const result = getParamsString({ foo: 'bar' });

    expect(result).toStrictEqual(expected);
  });

  test('It should return a URL-encoded string from a multi-item input', async () => {
    const expected = '?foo=bar&asdf=qwerty';

    const result = getParamsString({ foo: 'bar', asdf: 'qwerty' });

    expect(result).toBe(expected);
  });
});
