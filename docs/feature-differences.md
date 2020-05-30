# Twin and Tailwind differences

This document outlines the feature differences between Twin and Tailwind.

## Additional features

- tw can be imported as a named import { tw } from twin.macro. Not in TypeScript
- Container has left/right margins
- Container has left/right paddings
- Variants can be stacked - md:before:flex!

## Twin doesn't have

- [Class prefixes](https://tailwindcss.com/docs/configuration/#prefix)
- [Custom separators](https://tailwindcss.com/docs/configuration/#separator)
- You can't disable [core plugins](https://tailwindcss.com/docs/configuration/#core-plugins)
- Twin doesn't have an `important: true/false` option - use the trailing bang feature instead
- You can't limit the variants you have available on each class
