import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {extendLayer, onLoadLayerData} from './extendLayer';

const ID = 'grid-under100';
const LAYER_NAME = 'AcUnder100';
const DISABLED = false;

export const AcUnder100 = extendLayer(
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
      displayName: 'AC < 100 kV',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/electric_grid/under_100/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: false,
      getLineColor: (d) =>
        (d.properties.original.class === 'NOT AVAILABLE') ? [255, 255, 255] : [255, 255, 170],
      getLineWidth: (d) => 1,
      lineWidthUnits: 'pixels',
      // lineWidthScale: 1 / 2 ** (zoomLevel - 3),
      lineWidthMinPixels: .5,
      lineWidthMaxPixels: 20,
      lineCapRounded: true,
      lineJointRounded: true,

      onDataLoad: onLoadLayerData,
    });
  });