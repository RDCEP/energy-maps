import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {layerWrapper, onLoadLayerData} from './layerWrapper';

const ID = 'grid-345735';
const LAYER_NAME = 'Ac345735';
const DISABLED = false;

export const Ac345735 = layerWrapper(
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
      displayName: 'AC 345–735 kV',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/electric_grid/345_735_kV_AC/2012/1/1/${bbox}/`,
      pickable: true,
      autoHighlight: true,

      pointType: 'circle',
      stroked: true,
      filled: false,
      getLineColor: (d) =>
        (d.properties.original.class === '345') ? [255, 149, 0]
          : (d.properties.original.class === '500') ? [213, 113, 45]
            : [228, 53, 5],
      getLineWidth: (d) => {
        return (d.properties.original.class === '345') ? 1.9
          : (d.properties.original.class === '500') ? 2.5
            : 3.5
      },
      lineWidthUnits: 'pixels',
      // lineWidthScale: 1 / 2 ** (zoomLevel - 3),
      lineWidthMinPixels: .5,
      lineWidthMaxPixels: 20,
      lineCapRounded: true,
      lineJointRounded: true,

      onDataLoad: onLoadLayerData,
    })

  );