import type { Config } from 'tailwindcss'
import type { TwinConfigAll } from '../../src/core/types'

type TailwindConfig = Partial<Config>
type TwinConfig = Partial<TwinConfigAll>

export type { TailwindConfig, TwinConfig }
