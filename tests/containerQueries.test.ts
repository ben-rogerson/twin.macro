import { run } from './util/run'

it('container queries', async () => {
  const input = [
    'tw`@container`',
    'tw`@container-normal`',
    'tw`@container/sidebar`',
    'tw`@container-normal/sidebar`',
    'tw`@container-[size]/sidebar`',
    'tw`@md:underline`',
    'tw`@md/container1:underline`',
    'tw`@md/container2:underline`',
    'tw`@md/container10:underline`',
    'tw`@sm:underline`',
    'tw`@sm/container1:underline`',
    'tw`@sm/container2:underline`',
    'tw`@sm/container10:underline`',
    'tw`@lg:underline`',
    'tw`@lg/container1:underline`',
    'tw`@lg/container2:underline`',
    'tw`@lg/container10:underline`',
    'tw`@[1024px]:underline`',
    'tw`@[1024px]/container1:underline`',
    'tw`@[312px]:underline`',
    'tw`@[200rem]:underline`',
    'tw`@[123px]:underline`',
  ].join('; ')

  const config = {
    theme: {
      containers: {
        sm: '320px',
        md: '768px',
        lg: '1024px',
      },
    },
    plugins: [require('@tailwindcss/container-queries')],
  }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "containerType": "inline-size"
      });
      ({
        "containerType": "normal"
      });
      ({
        "containerType": "inline-size",
        "containerName": "sidebar"
      });
      ({
        "containerType": "normal",
        "containerName": "sidebar"
      });
      ({
        "containerType": "size",
        "containerName": "sidebar"
      });
      ({
        "@container (min-width: 768px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container1 (min-width: 768px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container2 (min-width: 768px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container10 (min-width: 768px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 320px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container1 (min-width: 320px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container2 (min-width: 320px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container10 (min-width: 320px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 1024px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container1 (min-width: 1024px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container2 (min-width: 1024px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container10 (min-width: 1024px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 1024px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container container1 (min-width: 1024px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 312px)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 200rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 123px)": {
          "textDecorationLine": "underline"
        }
      });
    `)
  })
})

it('should be possible to use default container queries', async () => {
  const input = [
    'tw`@md:underline`',
    'tw`@lg:underline`',
    'tw`@sm:underline`',
    'tw`@xs:underline`',
    'tw`@7xl:underline`',
    'tw`@6xl:underline`',
    'tw`@3xl:underline`',
    'tw`@5xl:underline`',
  ].join('; ')

  const config = {
    theme: {},
    plugins: [require('@tailwindcss/container-queries')],
  }

  return run(input, config).then(result => {
    expect(result).toMatchFormattedJavaScript(`
      ({
        "@container (min-width: 28rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 32rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 24rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 20rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 80rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 72rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 48rem)": {
          "textDecorationLine": "underline"
        }
      });
      ({
        "@container (min-width: 64rem)": {
          "textDecorationLine": "underline"
        }
      });
    `)
  })
})
