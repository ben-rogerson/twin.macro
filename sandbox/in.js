/**
 * Twin Sandbox
 * A place to test the output twin creates.
 * Good for general testing or for development of new features.
 *
 * Getting started
 * 1. Run the script: `npm run dev`
 * 2. Make a change to this file or to a file in the src folder
 * 3. Check `sandbox/out.js` for the macro output
 */

// @ts-nocheck
import tw, { globalStyles, css, styled, theme } from '../macro'

// Tw block
tw`bg-black/25`

// Styled component
tw.div`bg-black/25`

// Inline tw
;<div tw="bg-black/25" />
