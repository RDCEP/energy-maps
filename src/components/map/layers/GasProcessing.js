import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../MapIcons';
import {extendLayer} from './extendLayer';

const ID = 'processing-gas';
const LAYER_NAME = 'GasProcessing';
const DISABLED = false;

export const GasProcessing = extendLayer(
  {
    id: ID,
    layerName: LAYER_NAME,
    disabled: DISABLED,
  },
  function(zoomLevel, visible, assetValue) {

    return new GeoJsonLayer({
      id: ID,
      layerName: LAYER_NAME,
      disabled: DISABLED,
      componentName: `${LAYER_NAME}Layer`,
      displayName: 'Gas Processing',
      visible: visible,
      data: `${api_url}/processing_plants/gas/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'icon',
      stroked: false,
      filled: true,
      iconAtlas: iconAtlas,
      iconMapping: iconMapping,
      getIcon: ()=> 'triangle',
      getIconSize: function (d) {
        return 20000;
      },
      getIconColor: () => [0, 0, 139, 128],
      iconSizeUnits: 'meters',
      iconSizeScale: 1 / (zoomLevel - 3),
    });
  });