// Split a string at a value and return an array of the two parts
export default function splitOnFirst(input: string, delim: string): string[] {
  return (([first, ...rest]): [string, string] => [first, rest.join(delim)])(
    input.split(delim)
  )
}
