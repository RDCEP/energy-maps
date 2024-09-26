import {LayersList} from '@deck.gl/core';
import CoalMinesLayer from './layers/CoalMines';
import RailroadsLayer from './layers/Railroads';
import ToolTip from './ToolTip';
import {api_url, bbox} from '../../const/Api';

const onHover = function(info) {

  const {x, y, object} = info;
  if (object) {
    console.log(this)
    this.setState({
      visible: true, tooltip_x: x, tooltip_y: y,
      tooltip_text: object.properties.original.tot_prod,
    })
  } else {
    // ToolTip.innerHTML = '';
  }
}

const layers: LayersList = [
  new CoalMinesLayer({
    id: 'mines-coal',
    data: `${api_url}/mines/coal/2012/1/1/${bbox}/`,
    stroked: false,
    getPointRadius: (d) => Math.sqrt(d.properties.original.tot_prod),
    pointRadiusUnits: 'kilometer',
    pointRadiusScale: .0002,
    getFillColor: [0, 0, 0, 128],
    getLineColor: [0, 0, 0,128],
    pickable: true,
    autoHighlight: true,
    // onHover
  }),
  new RailroadsLayer({
    id: 'railroads',
    data: `${api_url}/railroads//2012/1/1/${bbox}/`,

  })
];

export default layers