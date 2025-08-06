import {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import StyledH6 from '../../const/StyledBlocks';
import {getLayersFromState} from '../map/Layers';
import MenuLayersItem from './MenuLayersItem';
import {useContext} from 'react';
import {ZoomLevelContext} from '../../contexts/ZoomContext';
import {LayerContext} from '../../contexts/LayerContext';
import {DataYearContext} from '../../contexts/DataYearContext';

const LayersList = styled.ul`
  padding: 0 3.5rem 0 2rem;
  position: relative;
`;

const MenuLayers = (props) => {
  const {contextZoomLevel} = useContext(ZoomLevelContext);
  const {contextDataYear} = useContext(DataYearContext);
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [zoomLevel, setZoomLevel] = contextZoomLevel;
  const [layerState, setLayerState] = contextLayerState;
  const [mapLayers, setMapLayers] = contextMapLayers;
  const [dataYear, setDataYear] = contextDataYear;
  const layers = getLayersFromState(layerState, zoomLevel, dataYear);

  return (
    <section>
      <StyledH6>Map Options</StyledH6>
      <LayersList>
        {[...layers].reverse().map((item, index) => (
          <MenuLayersItem
            key={item.id}
            id={item.id}
            index={index}
            layerName={item.props.layerName}
            displayName={item.props.displayName}
            assetValue={item.props.assetValue}
            checked={item.props.visible}
          />
        ))}
      </LayersList>
    </section>
  );
};

export default MenuLayers;
