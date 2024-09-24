import styled from 'styled-components';
import StyledH6 from '../../const/StyledBlocks';
import layers from '../map/Layers';
import MenuLayersItem from './MenuLayersItem';

const LayersList = styled.ul`
  padding: 0 3.5rem 0 2rem;
`;

const MenuLayers = (props) => {

  return (
    <section>
      <StyledH6>Map Options</StyledH6>
      <LayersList data-uk-sortable data-handle=".uk-sortable-handle" className="uk-sortable">
        {layers.map((item, index) => (
          <MenuLayersItem
            key={item.id}
            layer_slug={item.id}
            layer_name={item.layer_name}
          />
        ))}
      </LayersList>
    </section>
  );
};

export default MenuLayers;
