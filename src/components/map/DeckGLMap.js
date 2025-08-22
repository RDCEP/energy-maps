import React, {useContext} from 'react';
import DeckGL from '@deck.gl/react';
import {ZoomWidget, FullscreenWidget} from '@deck.gl/widgets';
import '@deck.gl/widgets/stylesheet.css';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import {getLayersFromState} from './Layers';
import {ZoomLevelContext} from '../../contexts/ZoomContext';
import {LayerContext} from '../../contexts/LayerContext';
import {DataYearContext} from '../../contexts/DataYearContext';
import {initialZoom} from '../../const/InitialState';

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
  zoom: initialZoom,
  minZoom: minZoom,
  maxZoom: maxZoom,
}

/**
 * Deck.GL map component. Handles the drawing of all map layers and the
 * basic map interactions (panning, zooming).
 *
 * @return {Element}
 * @constructor
 */
export const DeckGLMap = () => {
  const {contextZoomLevel} = useContext(ZoomLevelContext);
  const {contextDataYear} = useContext(DataYearContext);
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [zoomLevel, setZoomLevel] = contextZoomLevel;
  const [layerState] = contextLayerState;
  const [mapLayers, setMapLayers] = contextMapLayers;
  const [dataYear] = contextDataYear;

  /**
   * Updates map layers after user interactions. Updates current zoom level
   * to adjust scaling of map objects. Updates dataYear to trigger refreshed
   * data and asset totals.
   */
  const updateMapLayers = function() {
    setMapLayers(getLayersFromState(layerState, zoomLevel, dataYear));
  }

  /**
   * Updates the map during changes of the map view (e.g. during panning,
   * zooming).
   *
   * @param viewState
   * @param interactionState
   * @param oldViewState
   */
  const updateViewState = function(viewState, interactionState, oldViewState) {
    setZoomLevel(viewState.viewState.zoom);
    updateMapLayers();
  }

  /**
   * Debounced version of `updateViewState()`
   *
   * @type {(function(): (*))|*}
   */
  const debouncedUpdateViewState = debounce(updateViewState, 100);

  /**
   * Configuration of Deck.GL map widgets.
   *
   * @type {(ZoomWidget|FullscreenWidget)[]}
   */
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
        // onViewStateChange={zoomMap}
        onBeforeRender={updateMapLayers}
        onViewStateChange={debouncedUpdateViewState} >
        <Map mapStyle={MAP_STYLE} />
      </DeckGL>
    </StyledMap>
  );
};