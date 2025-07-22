import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';

class RailroadsLayer extends GeoJsonLayer{
  constructor(props) {
    super(props);
    this.layer_name = 'Railroads';
  }
  initializeState(){
    super.initializeState();
  }
};

const Railroads = new RailroadsLayer({
  id: 'railroads',
  data: `${api_url}/railroads//2012/1/1/${bbox}/`,
  componentName: 'railroads',
});

export default Railroads;