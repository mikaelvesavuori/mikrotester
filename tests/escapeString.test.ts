import { escapeString } from '../src/frameworks/escapeString';

describe('Success cases', () => {
  test('It should return back a string', async () => {
    const expected = '?asdf=qwerty&abc=foo';

    const result = escapeString('?asdf=qwerty&abc=foo');

    expect(result).toBe(expected);
  });

  test('It should escape input that is not a string', async () => {
    const expected = '{\\"asdf\\":\\"something%20here\\"}';

    const result = escapeString({ asdf: 'something here' });

    expect(result).toBe(expected);
  });
});
