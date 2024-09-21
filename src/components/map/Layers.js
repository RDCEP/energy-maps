import {Deck} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';

const api = 'https://api.energymaps.rdcep.org/api/v0.1.0/'

const layers = [
  { id: 'mines_coal',
    data: `${api}mines/coal/2012/`,
    getPosition: d => d.geometry.coordinates,
    getFillColor: [0, 0, 0, .8],
  }
];