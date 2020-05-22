# Twin + TypeScript: Module Augmentation

In addition to the steps outlined in one of the quick start guides above, you may want to take advantage of Twin's ability to enable you to import `styled` and/or `css` methods from the macro rather than directly from your CSS-in-JS library of choice.

Instead of having to do the following:

```typescript
// for emotion
import tw from 'twin.macro'
import { css } from '@emotion/core'
import { styled } from '@emotion/styled'

// or, for styled-components
import tw from 'twin.macro'
import styled, { css } from 'styled-components'
```

You can instead just use twin.macro's macro import feature:

```typescript
import tw, { css, styled } from 'twin.macro'
```

In order to do this, you need to perform two steps:

1. include a type definition for Twin, usually at the root of your application, e.g. `twin.d.ts` or in your `src` directory, e.g. `src/twin.d.ts`
2. update your Typescript configuration file (`tsconfig.json`)

## Step 1: create twin.d.ts

<details>
<summary>styled-components instructions</summary>

```typescript
// twin.d.t.s
import 'twin.macro' /* eslint-disable-line import/no-unassigned-import */
import styledComponent, { css as cssProperty } from 'styled-components'
declare module 'twin.macro' {
  const css: typeof cssProperty
  const styled: typeof styledComponent
}
```

</details>
<details>
<summary>emotion instructions</summary>

```typescript
// twin.d.t.s
import 'twin.macro'
import styledComponent from '@emotion/styled'
import { css as cssProperty } from '@emotion/core'
declare module 'twin.macro' {
  const css: typeof cssProperty
  const styled: typeof styledComponent
}
```

</details>

## Step 2: add the definition to your tsconfig

```typescript
// tsconfig.json
{
  //.. rest of your tsconfig
  "files": ["src/twin.d.ts"] // or twin.d.ts if in your project root
}
```
