import styled from 'styled-components';
import StyledH6 from '../../const/StyledBlocks';
import {getLayers} from '../map/Layers';
import MenuLayersItem from './MenuLayersItem';

const LayersList = styled.ul`
  padding: 0 3.5rem 0 2rem;
`;

const MenuLayers = (props) => {
  const layers = getLayers();

  return (
    <section>
      <StyledH6>Map Options</StyledH6>
      <LayersList data-uk-sortable data-handle=".uk-sortable-handle" className="uk-sortable">
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
