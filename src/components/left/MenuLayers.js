import {useRef, useEffect, useState} from 'react';
import {useContext} from 'react';
import {DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy,
  arrayMove, } from '@dnd-kit/sortable';
import styled from 'styled-components';
import StyledH6 from '../../const/StyledBlocks';
import {ZoomLevelContext} from '../../contexts/ZoomContext';
import {LayerContext} from '../../contexts/LayerContext';
import {DataYearContext} from '../../contexts/DataYearContext';
import {getLayersFromState} from '../map/Layers';
import MenuLayersItem from './MenuLayersItem';

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
  // const {contextZoomLevel} = useContext(ZoomLevelContext);
  // const {contextDataYear} = useContext(DataYearContext)
  // const [zoomLevel, setZoomLevel] = contextZoomLevel;
  // const [dataYear, setDataYear] = contextDataYear;
  const {contextLayerState, contextMapLayers} = useContext(LayerContext);
  const [layerState, setLayerState] = contextLayerState;
  const [mapLayers, setMapLayers] = contextMapLayers;
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor), );

  function handleDragStart(event) {
    const {active} = event;
    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const {active, over} = event;
    if (active.id !== over.id) {
      setLayerState((items) => {
        const oldIndex = items.map(i => i.id).indexOf(active.id);
        const newIndex = items.map(i => i.id).indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(active.id);
  }

  return (
    <section>
      <StyledH6>Map Options</StyledH6>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd} >
      <SortableContext
        items={mapLayers}
        strategy={verticalListSortingStrategy} >
        <LayersList>
          {[...mapLayers].reverse().map((item, index) => (
            <MenuLayersItem
              key={item.id}
              id={item.id}
              index={index}
              layerName={item.props.layerName}
              displayName={item.props.displayName}
              assetValue={item.props.assetValue}
              checked={item.props.visible} />
          ))}
        </LayersList>
      </SortableContext>
      </DndContext>
    </section>
  );
};

export default MenuLayers;
