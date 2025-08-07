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

/**
 * The list of map layers that appear in the left side of the interface.
 * The user manipulates this list to control the map display.
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const MenuLayers = (props) => {
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [mapLayers, setMapLayers] = contextMapLayers;

  return (
    <section>
      <StyledH6>Map Options</StyledH6>
      <LayersList>
        {[...mapLayers].reverse().map((item, index) => (
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
