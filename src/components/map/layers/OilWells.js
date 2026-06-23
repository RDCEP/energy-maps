import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../MapIcons';
import {layerWrapper, onLoadLayerData} from './layerWrapper';
import {data} from 'uikit/src/js/util';

const ID = 'wells-oil';
const LAYER_NAME = 'OilWells';
const DISABLED = false;

export const OilWells = layerWrapper(
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
      displayName: 'Oil Wells',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/wells/oil/${dataYear}/1/1/${bbox}/`,
      stroked: false,
      filled: true,
      pickable: true,
      // autoHighlight: true,
      // onHover

      pointType: 'icon',
      iconAtlas: iconAtlas,
      iconMapping: iconMapping,
      getIcon: () => 'square',
      getIconSize: 10,
      getIconColor: [34, 139, 34, 204],
      iconSizeUnits: 'pixels',
      iconSizeScale: 1 * zoomLevel / 10,

      onDataLoad: onLoadLayerData,
    })
  );