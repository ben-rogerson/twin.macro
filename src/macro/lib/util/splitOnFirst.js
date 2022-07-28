// Split a string at a value
export default (input, delim) =>
  (([first, ...rest]) => [first, rest.join(delim)])(input.split(delim))
