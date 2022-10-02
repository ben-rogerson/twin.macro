import * as prettier from 'prettier'
import { diff } from 'jest-diff'

function formatJavascript(input: string): string {
  return prettier.format(input.replace(/\n/g, ''), {
    parser: 'flow',
    printWidth: 100,
  })
}

function formatError(input: string): string {
  return String(input)
    .trim()
    .split('\n')
    .map(s => s.trim())
    .join('\n')
}

expect.extend({
  toMatchFormattedError(
    received: string,
    argument: string
  ): { actual: string; message: () => string; pass: boolean } {
    const options = {
      comment: 'stripped(received) === stripped(argument)',
      isNot: this.isNot,
      promise: this.promise,
    }

    const formattedReceived = formatError(received)
    const formattedArgument = formatError(argument)
    // startsWith check to avoid twin version match at the bottom of the error
    const pass = formattedReceived.startsWith(formattedArgument)

    const message = pass
      ? (): string =>
          this.utils.matcherHint(
            'toMatchFormattedJavaScript',
            undefined,
            undefined,
            options
          ) +
          '\n\n' +
          `Expected: ${this.utils.printExpected(formattedReceived)}\n` +
          `Received: ${this.utils.printReceived(formattedArgument)}`
      : (): string => {
          const actual = formattedReceived
          const expected = formattedArgument

          const diffString = diff(expected, actual, {
            expand: this.expand,
          })

          return (
            this.utils.matcherHint(
              'toMatchFormattedJavaScript',
              undefined,
              undefined,
              options
            ) +
            '\n\n' +
            (diffString?.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(actual)}`)
          )
        }

    return { actual: formattedReceived, message, pass }
  },
  toMatchFormattedJavaScript(
    received: string,
    argument: string
  ): { actual: string; message: () => string; pass: boolean } {
    const options = {
      comment: 'stripped(received) === stripped(argument)',
      isNot: this.isNot,
      promise: this.promise,
    }

    const formattedReceived = formatJavascript(received)
    const formattedArgument = formatJavascript(argument ?? '')
    const pass = formattedReceived === formattedArgument

    const message = pass
      ? (): string =>
          this.utils.matcherHint(
            'toMatchFormattedJavaScript',
            undefined,
            undefined,
            options
          ) +
          '\n\n' +
          `Expected: ${this.utils.printExpected(formattedReceived)}\n` +
          `Received: ${this.utils.printReceived(formattedArgument)}`
      : (): string => {
          const actual = formattedReceived
          const expected = formattedArgument

          const diffString = diff(expected, actual, {
            expand: this.expand,
          })

          return (
            this.utils.matcherHint(
              'toMatchFormattedJavaScript',
              undefined,
              undefined,
              options
            ) +
            '\n\n' +
            (diffString?.includes('- Expect')
              ? `Difference:\n\n${diffString}`
              : `Expected: ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(actual)}`)
          )
        }

    return { actual: received, message, pass }
  },
})
