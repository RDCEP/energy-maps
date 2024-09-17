class MenuLayerToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <li data-layer={props.layer_slug} className="option-li">
        <div uk-icon="icon: list" className="drag uk-sortable-handle uk-icon"
             style="user-select: none;">
        </div>
        <label>
          <span className="option-title">{props.layer_name}</span>
          <span className="asset-value"> ($41 B)</span>
          <span className="leader"></span>
          <input type="checkbox" className="checkbox coal-mines" data-layername="coal-mines" data-assetvalue="41474000000" />
        </label>
      </li>
    );
  }
}

const layers = {
  this_layer_name: {
    layer_slug: 'coal-mines',
    layer_name: 'Coal mines',
    asset_value: 41_000_000_000,
  }
};

// style={{background: `url(${props.src})`}}>

export default MenuLayerToggle;