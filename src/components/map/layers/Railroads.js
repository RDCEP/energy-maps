import {GeoJsonLayer} from '@deck.gl/layers';

export default class RailroadsLayer extends GeoJsonLayer{
  constructor(props) {
    super(props);
    this.layer_name = 'Railroads';
  }
  initializeState(){
    super.initializeState();
  }
};