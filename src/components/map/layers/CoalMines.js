import {ScatterplotLayer} from '@deck.gl/layers';
import {GeoJsonLayer} from '@deck.gl/layers';

export default class CoalMinesLayer extends GeoJsonLayer{
  constructor(props) {
    super(props);
    this.layer_name = 'Coal Mines';
  }
  initializeState(){
    super.initializeState();
  }
};