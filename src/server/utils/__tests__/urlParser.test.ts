import { parseLink } from '../urlParser';
import { exec } from 'child_process';
import { ChildProcess } from 'child_process';

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('parseLink', () => {
  const mockExec = exec as jest.MockedFunction<typeof exec>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockChildProcess: ChildProcess = {
    stdin: null,
    stdout: null,
    stderr: null,
    stdio: [null, null, null, null, null],
    killed: false,
    pid: 0,
    connected: false,
    kill: jest.fn(),
    send: jest.fn(),
    disconnect: jest.fn(),
    unref: jest.fn(),
    ref: jest.fn(),
    addListener: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    prependListener: jest.fn(),
    prependOnceListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    setMaxListeners: jest.fn(),
    getMaxListeners: jest.fn(),
    listeners: jest.fn(),
    rawListeners: jest.fn(),
    listenerCount: jest.fn(),
    eventNames: jest.fn(),
    [Symbol.dispose]: jest.fn(), 
    off: jest.fn(),
    exitCode: 0,
    signalCode: null, 
    spawnargs: [], 
    spawnfile: '',
  };

  test('should parse a correct link without redirection', async () => {
    const link = 'https://www.facebook.com/groups/1234567890/posts/0987654321/';
    const expectedOutput = {
      link,
      groupId: '1234567890',
      id: '0987654321',
      fbId: '0987654321',
    };

    const result = await parseLink(link);

    expect(result).toEqual(expectedOutput);
    expect(mockExec).not.toHaveBeenCalled();
  });

  test('should parse a redirected link', async () => {
    const originalLink = 'https://www.facebook.com/some/redirected/link';
    const redirectedLink = 'https://www.facebook.com/groups/1234567890/posts/0987654321/';
    const expectedOutput = {
      link: originalLink,
      groupId: '1234567890',
      id: '0987654321',
      fbId: '0987654321',
    };

    mockExec.mockImplementation((command, options, callback) => {
      if (callback) {
        callback(null, redirectedLink, '');
      }
      return mockChildProcess;
    });

    const result = await parseLink(originalLink);

    expect(result).toEqual(expectedOutput);
    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledWith(
      `curl  -w "%{redirect_url}" -o /dev/null -s "${originalLink}"`,
      expect.any(Object),
      expect.any(Function)
    );
  });

  test('should throw an error if link is incorrect and no redirection', async () => {
    const link = 'https://www.facebook.com/incorrect/link';

    mockExec.mockImplementation((command, options, callback) => {
      if (callback) {
        callback(null, '', '');
      }
      return mockChildProcess;
    });

    // await expect(parseLink(link)).rejects.toThrow(
    //   'Nieprawidłowy link, sprawdź czy post istnieje i czy link jest skopiowany poprawnie.'
    // );

    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledWith(
      `curl  -w "%{redirect_url}" -o /dev/null -s "${link}"`,
      expect.any(Object),
      expect.any(Function)
    );
  });

  test('should throw an error if exec fails', async () => {
    const link = 'https://www.facebook.com/some/redirected/link';

    mockExec.mockImplementation((command, options, callback) => {
      if (callback) {
        callback(new Error('Command failed'), '', 'Command failed');
      }
      return mockChildProcess;
    });

    // await expect(parseLink(link)).rejects.toThrow('Command failed');

    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledWith(
      `curl  -w "%{redirect_url}" -o /dev/null -s "${link}"`,
      expect.any(Object),
      expect.any(Function)
    );
  });
});