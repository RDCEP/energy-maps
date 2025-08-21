
export const extendLayer = function(args, func) {
  if (Array.isArray(args) || (args !== null && typeof args === 'object')) {
    for (const i in args) {
      func[i] = args[i];
    }
  }
  return func;
};

export const onLoadLayerData = function(data, obj) {
  const layerName = obj.layer.props.layerName;
  const element = document
    .querySelector(`.option-li input.${layerName}`)
    .removeAttribute('disabled');
}

