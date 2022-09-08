export default function isObject(value: unknown): boolean {
  // eslint-disable-next-line eqeqeq, no-eq-null
  return value != null && typeof value === 'object' && !Array.isArray(value)
}
