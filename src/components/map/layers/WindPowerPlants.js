import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../../../const/MapIcons';
import {extendLayer} from './extendLayer';

const ID = 'power-wind';
const LAYER_NAME = 'WindFarms';

export const WindFarms = extendLayer(
  {
    id: ID,
    layerName: LAYER_NAME,
  },
  function(zoomLevel, visible) {

    return new GeoJsonLayer({
      id: ID,
      layerName: LAYER_NAME,
      componentName: `${LAYER_NAME}Layer`,
      displayName: 'Wind Farms',
      visible: visible,
      data: `${api_url}/power_plants/wind/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: false,
      filled: true,
      getPointRadius: function (d) {
        return Math.sqrt(d.properties.original.total_cap);
      },
      getFillColor: () => [144, 29, 143, 128],
      pointRadiusUnits: 'meters',
      pointRadiusScale: 2000 / Math.sqrt(zoomLevel),

    });
  });