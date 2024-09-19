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
`

const StyledLabel = styled.label`
  display: flex;
  //flex-basis: content;
  align-items: baseline;
`

const OptionTitle = styled.span`
  flex-basis: content;
`

const AssetValue = styled.span`
  font-size: .8em!important;
  line-height: 1.25em;
  flex-basis: content;
`

const Leader = styled.span`
  flex-grow: 1;
  border-bottom: 1px solid black;
  margin: 0 .5em;
`

const LayersItemInput = styled.input`
  flex-basis: content;
`

const MenuLayersItem = (props) => {

  return (
    <StyledMenuLayersItem data-layer={props.layer_slug} className="option-li">
      <StyledLabel>
        <OptionTitle>{props.layer_name}</OptionTitle>
        <AssetValue> ($41 B)</AssetValue>
        <Leader />
        <LayersItemInput type="checkbox" className={props.layer_name}
          data-layername={props.la} data-assetvalue={props.asset_value} />
      </StyledLabel>
    </StyledMenuLayersItem>
  );
}

const layers = {
  this_layer_name: {
    layer_slug: 'coal-mines',
    layer_name: 'Coal mines',
    asset_value: 41_000_000_000,
  }
};

// style={{background: `url(${props.src})`}}>

export default MenuLayersItem;