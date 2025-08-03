import {useContext} from 'react';
import styled from 'styled-components';
import CssVars from '../../const/CssVars';
import {ZoomLevelContext} from '../../ZoomContext';
import {getLayers} from '../map/Layers';

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
`;

const MenuLayersItem = (props) => {

  // const {zoomLevel, setZoomLevel} = useContext(ZoomLevelContext);
  const {contextZoomLevel, contextMapLayers, contextDataYear} = useContext(ZoomLevelContext);
  // const [zoomLevel, setZoomLevel] = contextZoomLevel;
  const [mapLayers, setMapLayers] = contextMapLayers;
  // const [dataYear, setDataYear] = contextDataYear;
  const zoomLevel = contextZoomLevel[0];

  const updateMapLayersVisibility = function(id, visible) {
    console.log(id, visible)
    const mapLayersRef = [...mapLayers]
    let thisLayer = mapLayersRef.filter(obj => {
      return obj.id === id
    })
    if (thisLayer) {
      console.log(thisLayer)
      thisLayer.visible = !(visible === true);
    }
    setMapLayers(mapLayersRef);
  }

  return (
    <StyledMenuLayersItem data-layer={props.layerName} className="option-li">
      <StyledDrag data-uk-icon="icon: list"
           className="drag uk-sortable-handle uk-icon"
           style={{userSelect: 'none', }}>
      </StyledDrag>
      <StyledLabel>
        <StyledOptionTitle>{props.displayName}</StyledOptionTitle>
        <StyledAssetValue> ($41 B)</StyledAssetValue>
        <StyledLeader />
        <StyledLayersItemInput
          type="checkbox"
          className={props.layerName}
          data-layername={props.layerName}
          // data-assetvalue={props.asset_value}
          checked={props.checked}
          onChange={() => updateMapLayersVisibility(props.id, props.checked)}
        />
      </StyledLabel>
    </StyledMenuLayersItem>
  );
}

export default MenuLayersItem;