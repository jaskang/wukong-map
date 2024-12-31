import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'
import createPlugin from 'tailwindcss/plugin'

export default createPlugin(({ matchUtilities, addBase, theme, config }) => {
  const colors = flattenColorPalette(theme('colors'))
  const colorKeys = Object.keys(colors)
    .filter(key => key.endsWith('-500'))
    .reduce(
      (acc, key) => {
        const k = key.replace('-500', '')
        acc[k] = k
        return acc
      },
      {} as Record<string, string>
    )
  // console.log(theme('headui'))
  const { primary = 'blue', success = 'green', warning = 'yellow', danger = 'red', gray = 'stone' } = theme('headui')

  matchUtilities(
    {
      'variant-color': value => {
        return {
          '--color-accent-50': `var(--color-${value}-50)`,
          '--color-accent-100': `var(--color-${value}-100)`,
          '--color-accent-200': `var(--color-${value}-200)`,
          '--color-accent-300': `var(--color-${value}-300)`,
          '--color-accent-400': `var(--color-${value}-400)`,
          '--color-accent-500': `var(--color-${value}-500)`,
          '--color-accent-600': `var(--color-${value}-600)`,
          '--color-accent-700': `var(--color-${value}-700)`,
          '--color-accent-800': `var(--color-${value}-800)`,
          '--color-accent-900': `var(--color-${value}-900)`,
          '--color-accent-950': `var(--color-${value}-950)`,
        }
      },
    },
    {
      values: colorKeys,
    }
  )
  // 'solid' | 'soft' | 'outline' | 'text' | 'pure' | 'default'
  // addBase({
  //   ':root': {},
  // })
  // addComponents(
  //   {
  //     '.variant-default': {
  //       color: 'inherit',
  //       backgroundColor: 'var(--color-white)',
  //       border: '1px solid var(--color-natural-200)',
  //       '&:not(:disabled)': {
  //         '&:hover': {
  //           backgroundColor: `var(--color-natural-50)`,
  //         },
  //       },
  //     },
  //     '.variant-solid': {
  //       '--hvt-color': `var(--color-white)`,
  //       '--hvt-bg': `var(--color-primary-500)`,
  //       '--hvt-border': `transparent`,
  //       color: 'var(--hvt-color)',
  //       backgroundColor: 'var(--hvt-bg)',
  //       borderColor: 'var(--hvt-border)',
  //     },
  //     '.variant-soft': {
  //       '--hvt-color': `var(--color-primary-500)`,
  //       '--hvt-bg': `var(--color-primary-100)`,
  //       '--hvt-border': `transparent`,
  //       color: 'var(--hvt-color)',
  //       backgroundColor: 'var(--hvt-bg)',
  //       borderColor: 'var(--hvt-border)',
  //     },
  //     '.variant-outline': {
  //       '--hvt-color': `var(--color-primary-500)`,
  //       '--hvt-bg': `var(--color-white)`,
  //       '--hvt-border': `var(--color-primary-500)`,
  //       color: 'var(--hvt-color)',
  //       backgroundColor: 'var(--hvt-bg)',
  //       borderColor: 'var(--hvt-border)',
  //     },
  //     '.variant-text': {
  //       '--hvt-color': `var(--color-primary-500)`,
  //       '--hvt-bg': `var(--color-white)`,
  //       '--hvt-border': `var(--color-primary-500)`,
  //       color: 'var(--hvt-color)',
  //       backgroundColor: 'var(--hvt-bg)',
  //       borderColor: 'var(--hvt-border)',
  //     },
  //   },
  //   {}
  // )
})
