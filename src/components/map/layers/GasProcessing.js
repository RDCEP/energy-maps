import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../../../const/MapIcons';

export const GasProcessing = (zoomLevel) => {

  return new GeoJsonLayer({
    id: 'processing-gas',
    layerName: 'GasProcessing',
    componentName: 'GasProcessingLayer',
    displayName: 'Gas Processing',
    visible: false,
    data: `${api_url}/processing_plants/gas/2012/1/1/${bbox}/`,
    pickable: true,
    autoHighlight: true,

    pointType: 'icon',
    stroked: false,
    filled: true,
    iconAtlas: iconAtlas,
    iconMapping: iconMapping,
    getIcon: ()=> 'triangle',
    getIconSize: function (d) {
      return 12;
    },
    getIconColor: () => [0, 0, 139, 128],
    iconSizeUnits: 'pixels',
    iconSizeScale: 20 / Math.sqrt(zoomLevel),
  });
};