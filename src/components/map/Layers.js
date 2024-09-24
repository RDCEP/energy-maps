import {LayersList} from '@deck.gl/core';
import CoalMines from './layers/CoalMines';
import {api_url, bbox} from '../../const/Api';

const layers: LayersList = [
  new CoalMines({
    id: 'mines-coal',
    data: `${api_url}/mines/coal/2012/1/1/${bbox}/`,
    loadOptions: {
    },
    filled: true,
    getFillColor: [0, 0, 0, 255],
    pointType: 'circle',
    pointRadiusUnits: 'pixels',
    getPointRadius: 10,

  })
];

export default layers