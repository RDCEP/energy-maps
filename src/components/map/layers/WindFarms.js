import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {extendLayer} from './extendLayer';

const ID = 'power-wind';
const LAYER_NAME = 'WindFarms';
const DISABLED = false;

export const WindFarms = extendLayer(
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
      displayName: 'Wind Farms',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/power_plants/wind/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: true,
      getPointRadius: function (d) {
        return Math.sqrt(d.properties.original.total_cap / Math.PI);
      },
      getFillColor: () => [144, 29, 143, 128],
      getLineColor: () => [255, 255, 255],
      pointRadiusUnits: 'pixels',
      pointRadiusScale: 1 / Math.sqrt(2 ^ (zoomLevel - 3)),

    });
  });