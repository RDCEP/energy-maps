
import DeckGL from '@deck.gl/react';
import {Map} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styled from 'styled-components';
import layers from './Layers';

const StyledMap = styled.div`
  z-index: 510;
  background-color: #e7eff2;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`;

const DeckGLMap = (props) => {

  return (
    <StyledMap className="main-map">
      <DeckGL
        initialViewState={{
          longitude: -30,
          latitude: 51.47,
          zoom: 2
        }}
        controller
        layers={layers}
      >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL>
    </StyledMap>
  );
};

export default DeckGLMap;