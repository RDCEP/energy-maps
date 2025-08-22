import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {layerWrapper, onLoadLayerData} from './layerWrapper';

const ID = 'grid-100300';
const LAYER_NAME = 'Ac100300';
const DISABLED = false;

/**
 * Map Layer showing AC lines between 100 and 300 kV
 */
export const Ac100300 = layerWrapper(
  {
    id: ID,
    layerName: LAYER_NAME,
    disabled: DISABLED,
  },

  /**
   * Return a Deck.GL GeoJsonLayer to display AC lines between 100–300 kV.
   * zoomLevel controls
   * @param zoomLevel {Number} Adjusts scaling of lines, circles, and icons
   * @param visible {Boolean} Toggled by checkboxes in the left UI pane
   * @param assetValue {Number}
   * @return {GeoJsonLayer<FeaturePropertiesT, {id: string, layerName: string, disabled: boolean, componentName: string, displayName: string, assetValue, visible, data: string, pickable: boolean, autoHighlight: boolean, pointType: string, stroked: boolean, filled: boolean, getLineColor: (function(*): number[]), getLineWidth: (function(*): number), lineWidthUnits: string, lineWidthMinPixels: number, lineWidthMaxPixels: number, lineCapRounded: boolean, lineJointRounded: boolean, onDataLoad: onLoadLayerData}>}
   */
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

      onDataLoad: onLoadLayerData,
    });
  });