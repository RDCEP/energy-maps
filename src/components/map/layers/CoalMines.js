import {Deck} from '@deck.gl/core';
import {LayersList} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';
import api_url from '../../../const/Api';

type CoalMine = {
  lon: number,

}

const CoalMine = new ScatterplotLayer<Flight>({
    id: 'mines_coal',
    layer_name: 'Coal mines',
    data: `${api}mines/coal/2012/`,
    getPosition: d => d.geometry.coordinates,
    getFillColor: [0, 0, 0, .8],
  }
];

export default layers