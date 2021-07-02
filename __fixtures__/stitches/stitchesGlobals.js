import { globalStyles } from './macro'
import { global } from './stitches.config'

const globals = global(globalStyles)

export function App() {
  globals()
  // ...
}
