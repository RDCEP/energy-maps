import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {extendLayer} from './extendLayer';

const ID = 'power-petroleum';
const LAYER_NAME = 'PetroleumPlants';
const DISABLED = false;

export const PetroleumPlants = extendLayer(
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
      displayName: 'Petroleum Plants',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/power_plants/petroleum/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: true,
      getPointRadius: (d) =>
        (d.properties.original.total_cap / Math.PI) ** .5,
      getFillColor: () => [34, 139, 34, 128],
      getLineColor: () => [255, 255, 255],
      pointRadiusUnits: 'meters',
      lineWidthUnits: 'pixels',
      pointRadiusScale: 3000 / (2 ** ((zoomLevel - 3) / 2)),
      lineWidthScale: .66,
    });
  });