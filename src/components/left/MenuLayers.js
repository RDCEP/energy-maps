import styled from 'styled-components';
import StyledH6 from '../../const/StyledBlocks';
import {getLayersFromState} from '../map/Layers';
import MenuLayersItem from './MenuLayersItem';
import {useContext} from 'react';
import {ZoomLevelContext} from '../../ZoomContext';

const LayersList = styled.ul`
  padding: 0 3.5rem 0 2rem;
`;

const MenuLayers = (props) => {
  const {contextZoomLevel, contextLayerState, contextMapLayers, contextDataYear} = useContext(ZoomLevelContext);
  const [zoomLevel, setZoomLevel] = contextZoomLevel;
  const [layerState, setLayerState] = contextLayerState;
  const [mapLayers, setMapLayers] = contextMapLayers;
  const [dataYear, setDataYear] = contextDataYear;
  const layers = getLayersFromState(layerState, zoomLevel);

  return (
    <section>
      <StyledH6>Map Options</StyledH6>
      <LayersList
        data-uk-sortable
        data-handle=".uk-sortable-handle"
        className="uk-sortable"
        onStop={() => console.log('stop')}
      >
        {[...layers].reverse().map((item, index) => (
          <MenuLayersItem
            key={item.id}
            id={item.id}
            layerName={item.props.layerName}
            displayName={item.props.displayName}
            // assetValue={item.props.assetValue}
            checked={item.props.visible}
          />
        ))}
      </LayersList>
    </section>
  );
};

export default MenuLayers;
