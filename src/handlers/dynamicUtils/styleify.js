// Convert an array of objects into a single object
// Shallow merger

export default ({ prop, value }) =>
  Array.isArray(prop)
    ? prop.reduce(
        (accumulator, item) => ({
          ...accumulator,
          [item]: value,
        }),
        {}
      )
    : { [prop]: value }
