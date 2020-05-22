# Twin + TypeScript: Module Annotation

In addition to the steps outlined in one of the quick start guides above, you may want to take advantage of Twin's ability to .

Instead of having to do the following:

```typescript
import tw from 'twin.macro'
import { css } from '@emotion/core'
import { styled } from '@emotion/styled'
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
import 'twin.macro'
declare module 'twin.macro' {
  import styled, { css } from 'styled-components'
  export { css, styled }
}
```

</details>
<details>
<summary>emotion instructions</summary>

```typescript
// twin.d.t.s
import 'twin.macro'
declare module 'twin.macro' {
  import styled from '@emotion/styled'
  import { css } from '@emotion/core'
  export { css, styled }
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
