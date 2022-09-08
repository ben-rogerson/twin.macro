import { createMacro } from 'babel-plugin-macros'
import twinMacro from './macro/twin'

export default createMacro(twinMacro, { configName: 'twin' })
