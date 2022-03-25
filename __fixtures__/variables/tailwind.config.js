module.exports = {
  theme: {
    extend: {
      spacing: {
        'gutter-1/2': 'var(--gutter-half)',
      },
    },
  },
  plugins: [addComponentsTestCssVariableAsRuleProperty],
}

function addComponentsTestCssVariableAsRuleProperty({ addComponents }) {
  const styles = [
    {
      '.css-class-with-variable-as-rule-property': {
        '--some-css-variable-as-rule-prop': 'blue',
      },
    },
  ]

  addComponents(styles)
}
