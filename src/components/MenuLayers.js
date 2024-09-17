import layers from '../const/Layers';
import MenuLayersItem from './MenuLayersItem';

const MenuLayers = (props) => {

  return (
    <section>
      <h6>Map Options</h6>
      <ul uk-sortable data-handle=".uk-sortable-handle" className="uk-sortable">
        {layers.map((item, index) => (
          <MenuLayersItem
            layer_slug={item.layer_slug}
            layer_name={item.layer_name}
          />
        ))}
      </ul>
    </section>
  );
};

export default MenuLayers;
