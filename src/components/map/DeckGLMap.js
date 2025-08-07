import React, {useContext} from 'react';
import DeckGL from '@deck.gl/react';
import {ZoomWidget, FullscreenWidget} from '@deck.gl/widgets';
import '@deck.gl/widgets/stylesheet.css';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styled from 'styled-components';
import {getLayersFromState} from './Layers';
import {InitialState} from '../../const/InitialState';
import {ZoomLevelContext} from '../../contexts/ZoomContext';
import {LayerContext} from '../../contexts/LayerContext';
import {DataYearContext} from '../../contexts/DataYearContext';
import {data} from 'uikit/src/js/util';

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

const minZoom = 1;
const maxZoom = 10;

const INITIAL_VIEW_STATE = {
  longitude: -105,
  latitude: 40,
  zoom: InitialState,
  minZoom: minZoom,
  maxZoom: maxZoom,
}

const DeckGLMap = (props) => {

  const {contextZoomLevel} = useContext(ZoomLevelContext);
  const {contextDataYear} = useContext(DataYearContext);
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [zoomLevel, setZoomLevel] = contextZoomLevel;
  const [layerState, setLayerState] = contextLayerState;
  const [mapLayers, setMapLayers] = contextMapLayers;
  const [dataYear, setDataYear] = contextDataYear;

  const updateMapLayers = function() {
    setMapLayers(getLayersFromState(layerState, zoomLevel, dataYear));
  }

  const updateViewState = function(view) {
    setZoomLevel(view.viewState.zoom);
    updateMapLayers();
  }

  const widgets = [
    new ZoomWidget({
      placement: 'top-right',
      id: 'zoom-control',
    }),
    new FullscreenWidget({
      placement: 'top-right',
      id: 'fullscreen-control',
    })
  ];

  return (
    <StyledMap className="main-map">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller
        layers={mapLayers}
        widgets={widgets}
        onBeforeRender={updateMapLayers}
        onViewStateChange={updateViewState}
        // onViewStateChange={zoomMap}
      >

        <Map mapStyle={MAP_STYLE} />

      </DeckGL>
    </StyledMap>
  );
};

export default DeckGLMap;