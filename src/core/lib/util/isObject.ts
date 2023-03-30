export default function isObject(
  value: unknown
): value is Record<string, unknown> {
  // eslint-disable-next-line eqeqeq, no-eq-null
  return value != null && typeof value === 'object' && !Array.isArray(value)
}
