import {GeoJsonLayer} from '@deck.gl/layers';
// import {GL} from '@luma.gl/constants';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../../../const/MapIcons';
import {extendLayer} from './extendLayer';

const ID = 'mines-coal';
const LAYER_NAME = 'CoalMines';

export const CoalMines = extendLayer(
  {
    id: ID,
    layerName: LAYER_NAME,
  },
  function(zoomLevel, visible, assetValue) {

    return new GeoJsonLayer({
      id: ID,
      layerName: LAYER_NAME,
      componentName: `${LAYER_NAME}Layer`,
      displayName: 'Coal Mines',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/mines/coal/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'icon',
      stroked: false,
      filled: true,
      iconAtlas: iconAtlas,
      iconMapping: iconMapping,
      getIcon: () => 'pentagon',
      getIconSize: function (d) {
        return Math.sqrt(d.properties.original.tot_prod);
      },
      getIconColor: () => [0, 0, 0, 128],
      iconSizeUnits: 'meters',
      iconSizeScale: 20 / Math.sqrt(zoomLevel),

      // pointAntialiasing: false,
      // textureParameters: {
      //   [GL.TEXTURE_MIN_FILTER]: GL.LINEAR,
      //   [GL.TEXTURE_MAG_FILTER]: GL.LINEAR
      // },
      // loadOptions: {
      //   imagebitmap: {
      //     // resizeWidth: 150,
      //     resizeHeight: 1200
      //   }
      // },

    });
  });