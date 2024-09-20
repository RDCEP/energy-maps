import styled from 'styled-components';
import CssVars from '../../const/CssVars';
import StyledH6 from '../../const/StyledBlocks';
import layers from '../../const/Layers';
import MenuLayersItem from './MenuLayersItem';

const LayersSection = styled.section`
  
`

const LayersList = styled.ul`
  padding: 0 3.5rem 0 2rem;
`

const MenuLayers = (props) => {

  return (
    <section>
      <StyledH6>Map Options</StyledH6>
      <LayersList data-uk-sortable data-handle=".uk-sortable-handle" className="uk-sortable">
        {layers.map((item, index) => (
          <MenuLayersItem
            key={item.layer_slug}
            layer_slug={item.layer_slug}
            layer_name={item.layer_name}
          />
        ))}
      </LayersList>
    </section>
  );
};

export default MenuLayers;
