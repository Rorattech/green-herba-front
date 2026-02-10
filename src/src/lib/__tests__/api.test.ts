import { fetchHealth } from '../api';

describe('fetchHealth', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetAllMocks();
  });

  it('throws when API_URL not configured', async () => {
    delete process.env.API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    await expect(fetchHealth()).rejects.toThrow('API URL not configured');
  });

  it('fetches and returns data when API_URL set', async () => {
    process.env.API_URL = 'http://example.com';
    const mockResponse = {
      message: 'ok',
      status: 'ok',
      data: { version: '1', timestamp: 't' },
    };
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    await expect(fetchHealth()).resolves.toEqual(mockResponse);
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe('http://example.com/api/up');
  });
});
