import {LayersList} from '@deck.gl/core';
import CoalMines from './layers/CoalMines';
import {api_url, bbox} from '../../const/Api';

const layers: LayersList = [
  new CoalMines({
    id: 'mines-coal',
    data: `${api_url}/mines/coal/2012/1/1/${bbox}/`,
    loadOptions: {
    },
    stroked: false,
    getPosition: (d) => d.geometry.coordinates,
    getRadius: (d) => Math.sqrt(d.properties.original.tot_prod),
    getFillColor: [255, 140, 0],
    getLineColor: [0, 0, 0],

  })
];

export default layers