declare module '@babel/plugin-transform-react-jsx'

declare namespace jest {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Matchers<R> {
    toMatchFormattedError(error: string): R
    toMatchFormattedJavaScript(javascriptString: string): R
  }
}
