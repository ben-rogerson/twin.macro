import { run } from './util/run'

test('screen is replaced', async () => {
  const input = [
    'screen(`<sm`)',
    'screen(`md>`)',
    'screen(`mobile`)',
    'screen(`tablet`)',
    'screen(`mobile_desktop`)',
    'screen(`mobile,desktop`)',
    'screen(["mobile", "desktop"])',
  ].join('; ')
  const tailwindConfig = {
    theme: {
      screens: {
        '<sm': { max: '399px' },
        'md>': { min: '500px' },
        mobile: { max: '767px' },
        tablet: { min: '768px', max: '991px' },
        desktop: { min: '1600px' },
        mobile_desktop: [{ max: '767px' }, { min: '1600px' }],
        mobile_desktop_max: [{ max: '767px' }, { min: '1600px', max: '767px' }],
      },
    },
  }

  return run(input, tailwindConfig).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      "@media (max-width: 399px)";
      "@media (min-width: 500px)";
      "@media (max-width: 767px)";
      "@media (min-width: 768px) and (max-width: 991px)";
      "@media (max-width: 767px), (min-width: 1600px)";
      "@media (max-width: 767px), (min-width: 1600px)";
      "@media (max-width: 767px), (min-width: 1600px)";
    `)
  })
})
