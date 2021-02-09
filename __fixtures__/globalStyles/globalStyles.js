import { GlobalStyles } from './macro'
import { css, Global } from '@emotion/react'

const MyGlobals = () => (
  <div>
    <Global
      styles={css`
        body {
          background: red;
        }
      `}
    />
    <GlobalStyles />
  </div>
)
