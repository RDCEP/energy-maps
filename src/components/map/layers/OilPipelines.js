import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../MapIcons';
import {onLoadLayerData} from './layerWrapper';

export const OilPipelines = (zoomLevel) => {

  return new GeoJsonLayer({
    id: 'pipelines-oil',
    layerName: 'OilPipelines',
    componentName: 'OilPipelinesLayer',
    displayName: 'Oil Pipelines',
    visible: false,
    data: `${api_url}/pipelines/oil/2012/1/1/${bbox}/`,
    pickable: true,
    autoHighlight: true,

    pointType: 'circle',
    stroked: true,
    filled: false,
    getLineColor: () => [60, 179, 113, 255],
    getLineWidth: () => 1,
    lineWidthUnits: 'pixels',
    lineWidthScale:  Math.pow(zoomLevel, 2) / 16,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 20,
    lineCapRounded: true,
    lineJointRounded: true,

    onDataLoad: onLoadLayerData,
  });
};