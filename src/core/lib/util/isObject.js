export default value =>
  // eslint-disable-next-line eqeqeq, no-eq-null, @typescript-eslint/no-unnecessary-boolean-literal-compare
  value != null && typeof value === 'object' && Array.isArray(value) === false
