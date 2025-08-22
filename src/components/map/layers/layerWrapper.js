
export const layerWrapper = function(args, func) {
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
};

/**
 * This is stub. Reorders data returned to map layers in descending order
 * so that large icons are drawn underneath small icons.
 *
 * @param data {Object} GeoJSON object
 */
export const reorderDataBySize = function(data) {

};

/**
 * This is a stub. Retrieve locally cached data. This is used by the
 * map layer's dataComparator property.
 *
 * @param layerName
 */
export const getLocalDataCache = function(layerName) {

};

/**
 * This is a stub. Write GeoJSON data to the local cache. This is called
 * by `getLocalDataCache, which is used by the map layer's dataComparator
 * property.
 *
 * @param layerName
 */

export const setLocalDataCache = function(layerName, data) {

};

export const clearLocalDataCache = function(layerName) {

};