import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {extendLayer} from './extendLayer';

const ID = 'power-solar';
const LAYER_NAME = 'SolarPV';

export const SolarPV = extendLayer(
  {
    id: ID,
    layerName: LAYER_NAME,
  },
  function(zoomLevel, visible, assetValue) {

    return new GeoJsonLayer({
      id: ID,
      layerName: LAYER_NAME,
      componentName: `${LAYER_NAME}Layer`,
      displayName: 'Solar PV',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/power_plants/solar/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: true,
      getPointRadius: function (d) {
        return Math.sqrt(d.properties.original.total_cap / Math.PI) * .3;
      },
      getFillColor: () => [255, 215, 0, 128],
      getLineColor: () => [139, 64, 0],
      pointRadiusUnits: 'pixels',
      pointRadiusScale: 1 / Math.sqrt(zoomLevel),

    });
  });