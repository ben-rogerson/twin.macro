export type JSONPrimitive = string | number | boolean | undefined
export type JSONValue = JSONPrimitive | JSONObject

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface JSONObject extends Record<string, JSONValue> {}
export function getPackageVersions(): Record<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module
  const packageJson = require('./package.json') as JSONObject

  const versions = {
    twinVersion: packageJson.version as string,
    tailwindcssVersion:
      ((packageJson?.dependencies as JSONObject)
        ?.tailwindcss as unknown as string) ??
      ((packageJson?.devDependencies as JSONObject)
        ?.tailwindcss as unknown as string),
  }

  return versions
}
