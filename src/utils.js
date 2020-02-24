import resolveTailwindConfig from 'tailwindcss/lib/util/resolveConfig'
import defaultTailwindConfig from 'tailwindcss/stubs/defaultConfig.stub'
import { logNoClass } from './logging'
import dlv from 'dlv'
export { stringifyScreen } from './screens' // Here for backwards compat

let resolvedConfig

export function resolveConfig(config) {
  if (resolvedConfig) return resolvedConfig
  resolvedConfig = resolveTailwindConfig([config, defaultTailwindConfig])
  return resolvedConfig
}

function styleify({ prop, value }) {
  return Array.isArray(prop)
    ? prop.reduce(
        (acc, item) => ({
          ...acc,
          [item]: value
        }),
        {}
      )
    : { [prop]: value }
}

/**
 * Matches
 */

function matchString(value) {
  if (typeof value !== 'string') return
  return value
}

function matchDefaultValue(value) {
  if (typeof value !== 'object') return
  if (!value['default']) return
  return value['default']
}

function matchObject(value) {
  if (!value) return
  if (typeof value !== 'object') return
  return value
}

function checkNewStyle({ config, key, prop }) {
  // String
  const stringMatch = matchString(config[key])
  if (stringMatch) {
    return styleify({
      prop,
      value: stringMatch
    })
  }
  // Default
  const defaultValueMatch = matchDefaultValue(config[key])
  if (defaultValueMatch) {
    return styleify({
      prop,
      value: defaultValueMatch
    })
  }
  // Font family
  if (prop === 'fontFamily') {
    const objectMatch = matchObject(config[key])
    if (objectMatch && Array.isArray(Object.values(objectMatch))) {
      return styleify({
        prop,
        value: Object.values(objectMatch).join(', ')
      })
    }
  }
  // Object
  const objectMatch = matchObject(config[key])
  if (objectMatch) {
    const newStyleCheck = checkNewStyle({
      config: Object.values(objectMatch),
      key,
      prop
    })
    if (newStyleCheck) {
      return newStyleCheck
    }
  }

  return
}

export function resolveStyle(props) {
  const { styleList, key, className, config, matchedKey } = props
  // Get data for error messages
  const configFound = dlv(config, ['theme', styleList.config])
  const errorProps = { className, matchedKey, config: configFound }
  // Deal with Array items like 'font' or 'bg'
  if (Array.isArray(styleList)) {
    const resultsRaw = styleList.map(item => resolve(item, ...props))
    const results = Object.values(resultsRaw).find(
      x => x && Object.values(x)[0] !== undefined
    )
    if (!results) {
      throw new Error(logNoClass(errorProps))
    }
    return results
  }

  if (typeof styleList === 'object') {
    const results = resolve(styleList, ...props)
    if (!results) {
      throw new Error(logNoClass(errorProps))
    }
    const resultLength = Object.keys(results).length
    if (!resultLength) {
      throw new Error(logNoClass(errorProps))
    }
    return results
  }

  throw Error(`"${className}" requires "${key}" in the Tailwind config`)
}

function resolve(opt, { config, key, className, prefix }) {
  // Get the key from classNames style config
  const findKey = dlv(config, ['theme', opt.config], {})
  // Check the key is defined in the tailwind config
  const checkValidConfig = matchObject(findKey)
  if (!checkValidConfig) {
    throw new Error(`${className} expects ${opt.config} in the Tailwind config`)
  }
  // Check for hypenated key matches eg: row-span-2 ("span-2" being the key)
  const keyMatch = findKey[`${prefix}${key || 'default'}`] || null
  if (keyMatch) {
    const strResults = checkNewStyle({
      config: findKey,
      key: `${prefix}${key || 'default'}`,
      prop: opt.prop
    })
    if (strResults) {
      return strResults
    }
  }
  // Check using className splitting
  let classParts =
    className && className.includes('-')
      ? className.split('-').filter(Boolean)
      : [className]

  let index = 0
  // Match parts of the classname against the config
  for (const item of Object.entries(classParts)) {
    const [index, part] = item
    const partFound = Object.keys(findKey).includes(part)
    if (partFound) {
      const value = findKey[part] || null
      if (value) {
        const newKey = classParts[Number(index) + 1]
        const strResults = checkNewStyle({
          config: value,
          key: newKey,
          prop: opt.prop
        })
        if (strResults) {
          return strResults
        }
      }
    }
  }

  for (let _ of classParts) {
    index = index + 1

    const keyNext = classParts[index] ? classParts[index] : null
    const keyFound = findKey[`${prefix}${keyNext}`] || findKey['default']

    if (keyFound) {
      const strResults = checkNewStyle({
        className,
        config: keyFound,
        key,
        prop: opt.prop
      })

      if (strResults) {
        return styleify({
          prop: opt.prop,
          value: strResults
        })
      }
    }
  }

  return {}
}
