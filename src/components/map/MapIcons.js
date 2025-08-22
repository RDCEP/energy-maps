import icons from '../../static/images/icons.png'

/**
 * SVG graphic supplying icon shapes for the map layers.
 *
 * @type {{}}
 */
export const iconAtlas = icons

/**
 * Icon mapping used by map layers whose `pointType` property = 'icon'
 *
 * @type {{square: {x: number, y: number, width: number, height: number, mask: boolean}, triangle: {x: number, y: number, width: number, height: number, mask: boolean}, hexagon: {x: number, y: number, width: number, height: number, mask: boolean}, pentagon: {x: number, y: number, width: number, height: number, mask: boolean}, '+': {x: number, y: number, width: number, height: number, mask: boolean}, x: {x: number, y: number, width: number, height: number, mask: boolean}, triangle_down: {x: number, y: number, width: number, height: number, mask: boolean}, hex_vertical: {x: number, y: number, width: number, height: number, mask: boolean}}}
 */
export const iconMapping = {
  'square': {
    x: 300, y: 240, width: 360, height: 360, mask: true
  },
  'triangle': {
    x: 900, y: 240, width: 417, height: 360, mask: true
  },
  'hexagon': {
    x: 1500, y: 240, width: 417, height: 360, mask: true
  },
  'pentagon': {
    x: 2100, y: 240, width: 378, height: 360, mask: true
  },
  '+': {
    x: 2700, y: 240, width: 360, height: 360, mask: true
  },
  'x': {
    x: 3300, y: 240, width: 360, height: 360, mask: true
  },
  'triangle_down': {
    x: 3900, y: 240, width: 417, height: 360, mask: true
  },
  'hex_vertical': {
    x: 4500, y: 240, width: 312, height: 360, mask: true
  },
}

