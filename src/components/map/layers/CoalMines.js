import {GeoJsonLayer} from '@deck.gl/layers';
// import {GL} from '@luma.gl/constants';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../MapIcons';
import {layerWrapper, onLoadLayerData} from './layerWrapper';

const ID = 'mines-coal';
const LAYER_NAME = 'CoalMines';
const DISABLED = false;

export const CoalMines = layerWrapper(
  {
    id: ID,
    layerName: LAYER_NAME,
    disabled: DISABLED,
  },
  (zoomLevel, visible, assetValue) =>

    new GeoJsonLayer({
      id: ID,
      layerName: LAYER_NAME,
      disabled: DISABLED,
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
      getIcon: 'pentagon',
      getIconSize: (d) =>
        Math.sqrt(d.properties.original.tot_prod)
      ,
      getIconColor: [0, 0, 0, 128],
      iconSizeUnits: 'meters',
      iconSizeScale: 20 / Math.sqrt(zoomLevel),

      onDataLoad: onLoadLayerData,

    })

);