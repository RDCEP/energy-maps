import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {layerWrapper, onLoadLayerData} from './layerWrapper';

const ID = 'pipelines-gas';
const LAYER_NAME = 'GasPipelines';
const DISABLED = false;

export const GasPipelines = layerWrapper(
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
      displayName: 'Gas Pipelines',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/pipelines/gas/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: false,
      getLineColor: [0, 191, 255, 200],
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      lineWidthScale: 1 + (zoomLevel - 4) / 3,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 20,
      lineCapRounded: true,
      lineJointRounded: true,

      onDataLoad: onLoadLayerData,
    })

);