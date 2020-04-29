import dlv from 'dlv'
import { assert, isEmpty } from './../../utils'
import {
  matchString,
  matchNumberAsString,
  matchDefaultValue,
  matchObject,
} from './matches'
import styleify from './styleify'

function getMatch(style, { config, key, className, prefix }) {
  // Get the key from classNames style config
  const findKey =
    dlv(config, ['theme', style.config]) ||
    dlv(config, ['theme', style.configFallback])

  // Check the key is defined in the tailwind config
  const checkValidConfig = matchObject(findKey)
  assert(
    !checkValidConfig,
    `${className} expects ${style.config} in the Tailwind config`
  )

  // Check for hyphenated key matches eg: row-span-2 ("span-2" being the key)
  const keyMatch = findKey[`${prefix}${key || 'default'}`] || null
  if (keyMatch) {
    const stringResults = matchNewStyle({
      config: findKey,
      key: `${prefix}${key || 'default'}`,
      prop: style.prop,
    })
    if (stringResults) {
      return stringResults
    }
  }

  // Check using className splitting
  const classParts =
    className && className.includes('-')
      ? className.split('-').filter(Boolean)
      : [className]

  let index = 0
  // Match parts of the className against the config
  for (const item of Object.entries(classParts)) {
    const [index, part] = item
    const partFound = Object.keys(findKey).includes(part)
    if (partFound) {
      const value = findKey[part] || null
      if (value) {
        const newKey = classParts[Number(index) + 1]
        const stringResults = matchNewStyle({
          config: value,
          key: newKey,
          prop: style.prop,
        })
        if (stringResults) {
          return stringResults
        }
      }
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  for (const _ of classParts) {
    index = index + 1

    const keyNext = classParts[index] ? classParts[index] : null
    const keyFound = dlv(findKey, `${prefix}${keyNext}`)

    if (!isEmpty(keyFound)) {
      const stringResults = matchNewStyle({
        className,
        config: keyFound,
        key,
        prop: style.prop,
      })

      if (stringResults) {
        return styleify({ prop: style.prop, value: stringResults })
      }
    }
  }

  return {}
}

const matchNewStyle = ({ config, key, prop }) => {
  // String-ish
  const stringMatch =
    matchString(config[key]) || matchNumberAsString(config[key])

  if (stringMatch) {
    return styleify({
      prop,
      value: stringMatch,
    })
  }

  // Default
  const defaultValueMatch = matchDefaultValue(config[key])
  if (defaultValueMatch) {
    return styleify({
      prop,
      value: defaultValueMatch,
    })
  }

  // Font family
  if (prop === 'fontFamily') {
    const objectMatch = matchObject(config[key])
    if (objectMatch && Array.isArray(Object.values(objectMatch))) {
      return styleify({
        prop,
        value: Object.values(objectMatch).join(', '),
      })
    }
  }

  // Object
  const objectMatch = matchObject(config[key])
  if (objectMatch) {
    const newStyleCheck = matchNewStyle({
      config: Object.values(objectMatch),
      key,
      prop,
    })
    if (newStyleCheck) {
      return newStyleCheck
    }
  }
}

export default getMatch
