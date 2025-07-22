import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';


class CoalMinesLayer extends GeoJsonLayer{
  constructor(props) {
    super(props);
    this.layer_name = 'Coal Mines';
  }
  initializeState(){
    super.initializeState();
  }
};

const CoalMines = new CoalMinesLayer({
  id: 'mines-coal',
  data: `${api_url}/mines/coal/2012/1/1/${bbox}/`,
  stroked: false,
  getPointRadius: (d) => Math.sqrt(d.properties.original.tot_prod),
  pointRadiusUnits: 'kilometer',
  pointRadiusScale: .0002,
  getFillColor: [0, 0, 0, 128],
  getLineColor: [0, 0, 0, 128],
  pickable: true,
  autoHighlight: true,
  componentName: 'coal_mines',
  // onHover
});

export default CoalMines;