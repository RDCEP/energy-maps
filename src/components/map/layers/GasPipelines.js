import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../../../const/MapIcons';

export const GasPipelines = (zoomLevel) => {

  this.id = 'pipelines-gas';
  this.layerName = 'GasPipelines';

  return new GeoJsonLayer({
    id: this.id,
    layerName: this.layerName,
    componentName: `${this.layerName}Layer`,
    displayName: 'Gas Pipelines',
    visible: true,
    data: `${api_url}/pipelines/gas/2012/1/1/${bbox}/`,
    pickable: true,
    autoHighlight: true,

    pointType: 'circle',
    stroked: true,
    filled: false,
    getLineColor: () => [0, 191, 255, 200],
    getLineWidth: () => 1,
    lineWidthUnits: 'pixels',
    lineWidthScale:  Math.pow(zoomLevel, 2) / 16,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 20,
    lineCapRounded: true,
    lineJointRounded: true,
  });
};