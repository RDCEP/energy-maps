import React, {useCallback} from 'react';
import DeckGL from '@deck.gl/react';
import type, {PickingInfo} from '@deck.gl/core';
import {Map, NavigationControl, Popup, useControl} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {MjolnirEvent} from 'mjolnir.js';
import styled from 'styled-components';
import layers from './Layers';
import {Feature} from 'maplibre-gl';
import {on} from 'uikit/src/js/util';

const StyledMap = styled.div`
  z-index: 510;
  background-color: #e7eff2;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`;

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const DeckGLMap = (props) => {

  const onHover = useCallback((info: PickingInfo, event: MjolnirEvent) => {
    if (info.picked) { console.log(info); }
  }, []);

  return (
    <StyledMap className="main-map">
      <DeckGL
        initialViewState={{
          longitude: -105,
          latitude: 40,
          zoom: 4,
        }}
        controller
        // getTooltip={({object}: MVTLayerPickingInfo<PropertiesType>) => object && (object.properties.name || object.properties.layerName)}
        // getTooltip={({object}: PickingInfo<Feature<Geometry, PropertiesType>>) => object && object.properties.original.tot_prod}
        // getTooltip={({object}) => object && object.properties.original.tot_prod}
        onHover={onHover}
        layers={layers}
      >
        <Map mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" />
      </DeckGL>
    </StyledMap>
  );
};

export default DeckGLMap;