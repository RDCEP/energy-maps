import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';
import {iconAtlas, iconMapping} from '../../../const/MapIcons';

export const OilWells = (zoomLevel) => {

  this.id = 'wells-oil';
  this.layerName = 'OilWells';

  return new GeoJsonLayer({
    id: this.id,
    layerName: this.layerName,
    componentName: `${this.layerName}Layer`,
    displayName: 'Oil Wells',
    visible: false,
    data: `${api_url}/wells/oil/2012/1/1/${bbox}/`,
    stroked: false,
    filled: true,
    pickable: true,
    // autoHighlight: true,
    // onHover

    pointType: 'icon',
    iconAtlas: iconAtlas,
    iconMapping: iconMapping,
    getIcon: ()=> 'square',
    getIconSize: () => 10,
    getIconColor: () => [34, 139, 34, 204],
    iconSizeUnits: 'pixels',
    iconSizeScale: 1 * zoomLevel / 10,

  })

};