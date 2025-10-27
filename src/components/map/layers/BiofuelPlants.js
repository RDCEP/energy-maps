import {GeoJsonLayer} from '@deck.gl/layers';
import {layerWrapper, onLoadLayerData} from './layerWrapper';

const ID = 'power-bio';
const LAYER_NAME = 'BiofuelPlants';
const DISABLED = true;

export const BiofuelPlants = layerWrapper(
  {
    id: ID,
    layerName: LAYER_NAME,
    disabled: DISABLED,
  },
  (zoomLevel, dataYear, visible, assetValue) =>

    new GeoJsonLayer({
      id: ID,
      layerName: LAYER_NAME,
      disabled: DISABLED,
      componentName: `${LAYER_NAME}Layer`,
      displayName: 'Biofuel Plants',
      assetValue: assetValue,
      visible: visible,
      // data: `${api_url}/power_plants/biofuel/${dataYear}/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: true,
      getPointRadius: (d) =>
        (d.properties.original.total_cap / Math.PI) ** .5,
      getFillColor: [11, 36, 251, 128],
      getLineColor: [255, 255, 255],
      pointRadiusUnits: 'meters',
      lineWidthUnits: 'pixels',
      pointRadiusScale: 3000 / (2 ** ((zoomLevel - 3) / 2)),
      lineWidthScale: .66,

      onDataLoad: onLoadLayerData,
    })

  );