export const createId = (prefix = ''): string => {
  const cryptoApi = globalThis.crypto;
  const id = cryptoApi?.randomUUID
    ? cryptoApi.randomUUID()
    : `${Date.now().toString(36)}-${cryptoApi ? Array.from(cryptoApi.getRandomValues(new Uint8Array(8)), b => b.toString(16).padStart(2, '0')).join('') : 'no-crypto'}`;
  return prefix ? `${prefix}-${id}` : id;
};

export const createNumericCode = (digits = 6): string => {
  const max = 10 ** digits;
  const cryptoApi = globalThis.crypto;
  const value = cryptoApi
    ? cryptoApi.getRandomValues(new Uint32Array(1))[0] % max
    : Date.now() % max;
  return value.toString().padStart(digits, '0');
};
