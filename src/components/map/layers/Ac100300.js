import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {extendLayer} from './extendLayer';

const ID = 'grid-100300';
const LAYER_NAME = 'Ac100300';
const DISABLED = false;

export const Ac100300 = extendLayer(
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
      displayName: 'AC 100–300 kV',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/electric_grid/100_300_kV_AC/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: false,
      getLineColor: (d) =>
        (d.properties.original.class === '100-161') ? [86, 180, 233] : [55, 126, 184],
      getLineWidth: (d) =>
        (d.properties.original.class === '100-161') ? 1.25 : 1.5 ,
      lineWidthUnits: 'pixels',
      // lineWidthScale: 1 / 2 ** (zoomLevel - 3),
      lineWidthMinPixels: .5,
      lineWidthMaxPixels: 20,
      lineCapRounded: true,
      lineJointRounded: true,
    });
  });