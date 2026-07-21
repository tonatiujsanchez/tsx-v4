export { iconMap } from './IconMap'

import type { TechName } from '../types/index'
import { iconMap } from './IconMap'

export function getIcon(techKey: TechName): string {
  return iconMap[techKey]
}
