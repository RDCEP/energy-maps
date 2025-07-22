import {LayersList} from '@deck.gl/core';
import CoalMines from './layers/CoalMines';
import Railroads from './layers/Railroads';
import ToolTip from './ToolTip';
import coalMineLayer from '../Main';


const onHover = function(info) {

  const {x, y, object} = info;
  if (object) {
    console.log(this)
    this.setState({
      visible: coalMineLayer, tooltip_x: x, tooltip_y: y,
      tooltip_text: object.properties.original.tot_prod,
    })
  } else {
    // ToolTip.innerHTML = '';
  }
}

const layers: LayersList = [
  CoalMines,
  Railroads,
];

export default layers