import {useContext} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import styled from 'styled-components';
import {CssVars} from '../../const/CssVars';
import {LayerContext} from '../../contexts/LayerContext';
import {getLayersFromState} from '../map/Layers';
import {DragHandle} from './DragHandle';
import {prettyAssetValue} from '../header/AssetTotal';
import {ZoomLevelContext} from '../../contexts/ZoomContext';
import {DataYearContext} from '../../contexts/DataYearContext';
import {AssetValueContext} from '../../contexts/AssetValueContext';

const StyledMenuLayersItem = styled.li`
  display: block;
  position: relative;
  list-style-type: none;
  font-size: .75rem!important;
  margin: 0 0 1em;
  padding-left: 1.5rem;
  overflow: visible;
  color: ${CssVars.black};
  
  &.inactive {
    color: ${CssVars.dark_grey};
  }
  
  &.uk-sortable-item {
    width: 13rem!important;    
  }
`;

const StyledLabel = styled.label`
  display: flex;
  //flex-basis: content;
  align-items: baseline;
`;

const StyledOptionTitle = styled.span`
  flex-basis: content;
`;

const StyledAssetValue = styled.span`
  font-size: .8em!important;
  line-height: 1.25em;
  flex-basis: content;
`;

const StyledLeader = styled.span`
  flex-grow: 1;
  border-bottom: 1px solid black;
  margin: 0 .5em;
`;

const StyledLayersItemInput = styled.input`
  flex-basis: content;
`;

const StyledDrag = styled.div`
  width: 1em;
  position: absolute;
  // right: CssVars.options_width - 6.5rem
  right: 13.5rem;
  display: inline-block;
  line-height: 1.45em;
  margin: 0;
  border: none;
  border-radius: 0;
  overflow: visible;
  font: inherit;
  color: inherit;
  text-transform: none;
  padding: 0;
  background-color: transparent;
  line-height: 1.4;
  cursor: move;
`;

/**
 * An item in the list of map layers in the interface on the left side of
 * the application. Each item has a checkbox to toggle the visibility
 * of a map layer, and can be dragged and reordered within the list
 * to reorder the layers in the map.
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const MenuLayersItem = (props) => {

  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const {contextZoomLevel} = useContext(ZoomLevelContext);
  const {contextDataYear} = useContext(DataYearContext);
  const {contextAssetValue} = useContext(AssetValueContext);
  const [layerState, setLayerState] = contextLayerState;
  const [mapLayers, setMapLayers] = contextMapLayers;
  const [zoomLevel, setZoomLevel] = contextZoomLevel;
  const [dataYear, setDataYear] = contextDataYear;
  const [totalAssetValue, setTotalAssetValue] = contextAssetValue;

  const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id: props.id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const updateMapLayersVisibility = function(id, visible) {
    const layersRef = [...layerState]
    setLayerState([...layersRef].map(layer => {
      if (layer.func.id === id) {
        layer.visible = !(visible === true);
      }
      return layer;
    }));
    setTotalAssetValue(prettyAssetValue(
      layerState.reduce((acc, val) => acc + val.assetValue, 0)
    ));
    setMapLayers(getLayersFromState(layerState, zoomLevel, dataYear));
  }

  return (
    <StyledMenuLayersItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      data-layer={props.layerName}
      data-id={props.id}
      className="option-li"
    >
      <StyledDrag
        className="drag"
        {...listeners}
      >
        <DragHandle />
      </StyledDrag>
      <StyledLabel>
        <StyledOptionTitle>{props.displayName}</StyledOptionTitle>&nbsp;
        <StyledAssetValue>({prettyAssetValue(props.assetValue)})</StyledAssetValue>
        <StyledLeader />
        <StyledLayersItemInput
          type="checkbox"
          className={props.layerName}
          data-layername={props.layerName}
          data-assetvalue={props.assetValue}
          checked={props.checked}
          onChange={() => updateMapLayersVisibility(props.id, props.checked)}
        />
      </StyledLabel>
    </StyledMenuLayersItem>
  );
}