import styled from 'styled-components';
import CssVars from '../../const/CssVars';

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

  return (
    <StyledMenuLayersItem data-layer={props.layer_slug} className="option-li">
      <StyledDrag data-uk-icon="icon: list"
           className="drag uk-sortable-handle uk-icon"
           style={{userSelect: 'none', }}>
      </StyledDrag>
      <StyledLabel>
        <StyledOptionTitle>{props.layer_name}</StyledOptionTitle>
        <StyledAssetValue> ($41 B)</StyledAssetValue>
        <StyledLeader />
        <StyledLayersItemInput type="checkbox" className={props.layer_slug}
          data-layername={props.layer_slug} data-assetvalue={props.asset_value}
          onChange={e => console.log(props) } />
      </StyledLabel>
    </StyledMenuLayersItem>
  );
}

export default MenuLayersItem;