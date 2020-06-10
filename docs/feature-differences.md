# Feature differences

This document aims to outline some of the differences between Tailwind and Twin.

These Tailwind features are not available:

- [Core plugins](https://tailwindcss.com/docs/configuration/#core-plugins) and [variants](https://tailwindcss.com/docs/configuration/#variants) can't be disabled<br/>Twin allows all classes and variants to be used without restriction
- No built-in IE 11 compatibility<br/>CSS variables aren't supported but you can add support with [css-vars-ponyfill](https://jhildenbiddle.github.io/css-vars-ponyfill/#/) (6k minified + gzipped) [[Browser usage stats]](https://caniuse.com/usage-table)
- No custom [class prefix](https://tailwindcss.com/docs/configuration/#prefix) option
- No [custom separator](https://tailwindcss.com/docs/configuration/#separator) option
- No [important option](https://tailwindcss.com/docs/configuration/#important)<br/>On individual classes add `!important` with a trailing bang instead, eg: `flex!`
- No css `@apply`<br/>Use a reusable variable instead, eg: `` const styles = tw`bg-black w-4 h-4` ``

<!-- ### Additional features

- Independent [left and right margins and paddings can be added](https://tailwindcss.com/docs/container.md) on `container`
- Multiple variants can be stacked<br/>eg: `md:before:flex`
- The before: and after: variants can be activated with a content class<br>`before:content before:p-10` -->
