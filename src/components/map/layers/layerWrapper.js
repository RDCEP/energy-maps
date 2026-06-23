
export const layerWrapper = (args, func) => {
  if (Array.isArray(args) || (args !== null && typeof args === 'object')) {
    for (const i in args) {
      func[i] = args[i];
    }
  }
  return func;
};

// noinspection JSVoidFunctionReturnValueUsed
export const onLoadLayerData = (data, obj) => {
  const layerName = obj.layer.props.layerName;
  // noinspection JSVoidFunctionReturnValueUsed
  const element = document.querySelector(`.option-li input.${layerName}`);
  element.removeAttribute('disabled');
  return true;
};

export const disableAllLayers = () => {
  const elements = document.querySelectorAll(`.option-li input`);
  elements.forEach((element) => element.setAttribute('disabled', true));
}

/**
 * This is stub. Reorders data returned to map layers in descending order
 * so that large icons are drawn underneath small icons.
 *
 * @param data {Object} GeoJSON object
 */
export const reorderDataBySize = (data) => {

};

/**
 * This is a stub. Retrieve locally cached data. This is used by the
 * map layer's dataComparator property.
 *
 * #TODO: If data layers' visibility states are stored in local cache, also
 * need to maintain total asset value.
 *
 * @param layerName
 */
export const getLocalDataCache = (layerName) => {

};

/**
 * This is a stub. Write GeoJSON data to the local cache. This is called
 * by `getLocalDataCache, which is used by the map layer's dataComparator
 * property.
 *
 * @param layerName
 */

export const setLocalDataCache = (layerName, data) => {

};

export const clearLocalDataCache = (layerName) => {

};