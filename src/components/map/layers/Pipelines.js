import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';

class OilPipelinesLayer extends GeoJsonLayer{
  constructor(props) {
    super(props);
    this.layer_name = 'Oil Pipelines';
    this.visible = false;
  }
  initializeState(){
    super.initializeState();
  }
};

const OilPipelines = new OilPipelinesLayer({
  id: 'pipelines_oil',
  data: `${api_url}/pipelines/oil/2012/1/1/${bbox}/`,
  // componentName: 'railroads',
});

export default OilPipelines;