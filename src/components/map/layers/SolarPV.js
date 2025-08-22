import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {layerWrapper, onLoadLayerData} from './layerWrapper';

const ID = 'power-solar';
const LAYER_NAME = 'SolarPV';
const DISABLED = false;

export const SolarPV = layerWrapper(
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
      displayName: 'Solar PV',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/power_plants/solar/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: true,
      getPointRadius: (d) =>
        (d.properties.original.total_cap / Math.PI) ** .5,
      getFillColor: () => [255, 215, 0, 128],
      getLineColor: () => [139, 64, 0],
      pointRadiusUnits: 'meters',
      lineWidthUnits: 'pixels',
      pointRadiusScale: 3000 / (2 ** ((zoomLevel - 3) / 2)),
      lineWidthScale: .66,

      onDataLoad: onLoadLayerData,
    });
  });