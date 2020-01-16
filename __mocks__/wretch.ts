// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchMock = require('fetch-mock');
const wretch = require('wretch')

module.exports = wretch().polyfills({
  fetch: fetchMock.sandbox()
});