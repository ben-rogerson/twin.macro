const CAMEL_FIND = /\W+(.)/g

export default function camelize(string: string): string {
  return string?.replace(CAMEL_FIND, (_, chr: string) => chr.toUpperCase())
}
