# Use Twin with TypeScript + Emotion

To make working with [Emotion](https://emotion.sh/docs/introduction) easier, Twin has the ability to import `styled` and/or `css` methods on your behalf.

So instead of adding these imports each time:

```typescript
import tw from 'twin.macro'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
```

You can utilize Twin’s auto import feature:

```typescript
import tw, { css, styled } from 'twin.macro'
```

## Setup

Without types defined, you’ll receive an error like this:

```js
Module '"../node_modules/twin.macro/types"' has no exported member 'styled'.
// or
Module '"../node_modules/twin.macro/types"' has no exported member 'css'.
```

So to fix this, we’ll need to setup our type definitions:

### 1. Define the types in a new file

Create a new file named `twin.d.ts` and place it in your project root (or your src directory for create-react-app):

```typescript
// twin.d.ts
import 'twin.macro'
import styledComponent from '@emotion/styled'
import { css as cssProperty } from '@emotion/core'

declare module 'twin.macro' {
  const css: typeof cssProperty
  const styled: typeof styledComponent
}
```

### 2. Include the file in your TypeScript config

Update your `tsconfig.json` file with your new type file location:

```typescript
// tsconfig.json
{
  "files": ["twin.d.ts"],
  // or
  "include": ["twin.d.ts"],
}
```

You can now use the following imports in TypeScript:

```typescript
import tw, { css, styled, theme } from 'twin.macro'
```

## Installation guides

- ["Vanilla" React + Emotion](react.md)
- [Create React App + Emotion](create-react-app.md)
- [Gatsby + Emotion](gatsby.md)
- [Next.js + Emotion](next.md)
