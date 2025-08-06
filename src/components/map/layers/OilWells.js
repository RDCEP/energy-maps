import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../../../const/MapIcons';
import {extendLayer} from './extendLayer';

const ID = 'wells-oil';
const LAYER_NAME = 'OilWells';

export const OilWells = extendLayer(
  {
    id: ID,
    layerName: LAYER_NAME,
  },
  function(zoomLevel, visible, assetValue) {

    return new GeoJsonLayer({
      id: ID,
      layerName: LAYER_NAME,
      componentName: `${LAYER_NAME}Layer`,
      displayName: 'Oil Wells',
      assetValue: assetValue,
      visible: visible,
      data: `${api_url}/wells/oil/2012/1/1/${bbox}/`,
      stroked: false,
      filled: true,
      pickable: true,
      // autoHighlight: true,
      // onHover

      pointType: 'icon',
      iconAtlas: iconAtlas,
      iconMapping: iconMapping,
      getIcon: () => 'square',
      getIconSize: () => 10,
      getIconColor: () => [34, 139, 34, 204],
      iconSizeUnits: 'pixels',
      iconSizeScale: 1 * zoomLevel / 10,
    });
  });