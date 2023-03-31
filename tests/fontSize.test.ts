import { run, html } from './util/run'

test('font-size utilities can include a line-height modifier', async () => {
  const input = html`
    <div class="text-sm md:text-base">
      <div class="text-sm/6 md:text-base/7"></div>
      <div class="text-sm/[21px] md:text-base/[33px]"></div>
      <div class="text-[13px]/6 md:text-[19px]/8"></div>
      <div class="text-[17px]/[23px] md:text-[21px]/[29px]"></div>
      <div class="text-sm/999 md:text-base/000"></div>
    </div>
  `

  const config = {
    theme: {
      fontSize: {
        sm: ['12px', '20px'],
        base: ['16px', '24px'],
      },
      lineHeight: {
        6: '24px',
        7: '28px',
        8: '32px',
      },
    },
  }

  // @ts-expect-error Tailwind types aren't updated for array fontSize values
  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      React.createElement(
        "div",
        { class: "text-sm md:text-base" },
        React.createElement("div", { class: "text-sm/6 md:text-base/7" }),
        React.createElement("div", { class: "text-sm/[21px] md:text-base/[33px]" }),
        React.createElement("div", { class: "text-[13px]/6 md:text-[19px]/8" }),
        React.createElement("div", { class: "text-[17px]/[23px] md:text-[21px]/[29px]" }),
        React.createElement("div", { class: "text-sm/999 md:text-base/000" })
      );
    `)
  })
})
