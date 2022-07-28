export default string =>
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  string && string.replace(/\W+(.)/g, (_, chr) => chr.toUpperCase())
