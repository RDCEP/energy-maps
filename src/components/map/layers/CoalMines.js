import {GeoJsonLayer} from '@deck.gl/layers';
import {api_url, bbox} from '../../../const/Api';


class CoalMinesLayer extends GeoJsonLayer{
  constructor(props) {
    super(props);
    this.layer_name = 'Coal Mines';
    this.visible = false;
  }
  initializeState(){
    super.initializeState();
  }
};

const CoalMines = new CoalMinesLayer({
  id: 'mines-coal',
  data: `${api_url}/mines/coal/2012/1/1/${bbox}/`,
  stroked: false,
  filled: true,
  pointType: 'circle+text',
  pickable: true,
  getFillColor: [0, 0, 0, 128],
  getLineColor: [0, 0, 0, 128],
  getText: (d) => d.properties.original.tot_prod,
  getLineWidth: 0,
  getPointRadius: (d) => Math.sqrt(d.properties.original.tot_prod),
  pointRadiusUnits: 'kilometers',
  pointRadiusScale: .002,
  autoHighlight: true,
  componentName: 'coal_mines',
  getTextSize: 12,
  // onHover
});

export default CoalMines;