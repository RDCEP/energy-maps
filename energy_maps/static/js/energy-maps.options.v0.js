EnergyMaps = (function (EnergyMaps) {

  'use strict';

  /**
   * @param  {String} s - the supplied character string to be formatted
   * @returns {String} the supplied string with the first letter capitalized
   * @memberof Init
   */
  const _capitalizeFirstLetter = function _capitalizeFirstLetter
    (s)
  {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  /**
   * @description Generate a label for a checkbox in the menu.
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - an HTML5 label tag with a class
   * that corresponds to the `lyr` object
   * and a descriptive formatted text string.
   * @memberof Init
   */
  const _initMenuCheckboxLabel = function _initMenuCheckboxLabel
    (lyr)
  {
    let li = d3.select('.options-list ul')
      .append('li')
      // .attr('class', 'option-li')
      .attr('data-layer', lyr.name)
      .attr('class', () => {
        return (!lyr.drawProps || lyr === EnergyMaps.oilProductPipeline)
          ? 'option-li inactive' : 'option-li'
    });
    li.append('div')
      .attr('uk-icon', 'icon: list')
      .attr('class', 'drag uk-sortable-handle');
    let label = li.append('label');
    label.append('span').attr('class', 'option-title')
      .text(function() {
        return (lyr.text)
          ? lyr.text
          : `${_capitalizeFirstLetter(lyr.name
            .replace(/ /g, '\u00A0') // Replacing a normal space with nbsp;
            .replace(/-/g, '\u00A0'))}\u00A0`
      })

    return label;
  };

  /**
   * @description Generate an asset value for a checkbox in the menu.
   * @param {Object} layer - An object from layers[].
   * @param {Object} label
   * @return {Object} checkbox_span - an HTML5 span tag with that displays
   * total asset value for the menu item.
   * abbreviated in either billions or trillions. Child of a parent label tag.
   * @memberof Init
   */
  const _initMenuAssetSpan = function _initMenuAssetSpan
    (layer, label)
  {
    if (layer.assetValue[DATA_YEAR] !== 0
      && layer.name !== 'state-boundaries'
      && layer.name !== 'wind-capacity'
      && layer.name !== 'oil-product-pipelines')
    {
      label.append('span')
        .attr('class', 'asset-value')
        // FIXME: This is a horrible kludge in order to get space before units.
        //  Need to write a proper formatter.
      showLayerAssetTotal(layer);
    }
    label.append('span')
      .attr('class', 'leader');
    return label;
  };

  const showLayerAssetTotal = function showLayerAssetTotal
    (layer, dataYear)
  {
    if (layer.assetValue[dataYear] !== 0
      && layer.name !== 'state-boundaries'
      && layer.name !== 'wind-capacity'
      && layer.name !== 'oil-product-pipelines')
    {
      let label = d3.select(`[data-layer=${layer.name}] .asset-value`);
      let text = ` ($${_capitalizeFirstLetter(
        d3.format('.2~s')(layer.assetValue[DATA_YEAR])
          .replace(/G/, ' B')
          .replace(/T/, ' T'))})`;
      text = (layer.unchanged_2022 === true && dataYear === 2022) ? text + ' *' : text;
      label.text(text);
    }
  };

  /**
   * @description Generate a menu item.
   * @param {Object} lyr - An object from layers[].
   * @return {Object} checkbox_span - HTML5 label and span as children
   * of a column
   * div in the menu.
   * @memberof Init
   */
  const _initMenuItem = function _initMenuItem
    (lyr)
  {
    let label = _initMenuCheckboxLabel(lyr);
    label = _initMenuAssetSpan(lyr, label);
    return label;
  };

  /**
   * @description Generate each checkbox in the menu.
   * @param {Object} lyr - An object from layers[].
   * @param {Object} label
   * @return {Object} lyr.checkbox - a `checkbox` property added to the lyr item
   * containing a checkbox input tag.
   * @memberof Init
   */
  const _initMenuCheckbox = function _initMenuCheckbox
    (lyr, label)
  {
    lyr.checkbox = label.append('input')
      .attr('type', 'checkbox')
      .attr('class', `checkbox ${lyr.name}`)
      .attr('data-layername', lyr.name)
      .attr('data-assetvalue', lyr.assetValue[DATA_YEAR]);
    if (!(lyr.drawProps && (lyr !== EnergyMaps.oilProductPipeline))) {
      lyr.checkbox.attr('disabled', true);
    }
    return lyr.checkbox;
  };

  const activateDeactivateLayer = function activateDeactivateLayer
    ()
  {

    let that = d3.select(this);
    let layerName = that.attr('data-layername');
    let layer = LAYERS.find(obj => {
      return obj.name === layerName
    });
    // checkbox is buried in a ut {} object for some reason
    let checkbox = layer.checkbox._groups[0][0];

    if (checkbox.checked) {
      EnergyMaps.addLayer(layer);
    } else {
      EnergyMaps.removeLayer(layer);
    }
    // if (!(lyr instanceof StateBoundary)) {
    if (!(layer.name === 'state-boundaries')) {
      EnergyMaps.legendCtx.clearRect(0, 0, EnergyMaps.width, EnergyMaps.height);
      EnergyMaps.legendTmpCtx.clearRect(0, 0, EnergyMaps.width, EnergyMaps.height);
      EnergyMaps.updateLegend(EnergyMaps.legendTmpCtx, EnergyMaps.legendCtx, LAYERS);
      if (ACTIVE_LAYERS.length === 0) {
        EnergyMaps.legend.property('hidden', true);
      }
    }
    EnergyMaps.setCookieLayers();
  };

  /**
   * @description Initializes the creation of the map options menu.
   * @return
   * @memberof
   */
  const initMenu = function initMenu
    ()
  {
    for (let i = 0, n = LAYERS.length; i < n; ++i) {

      let lyr = LAYERS[i];

      let li = _initMenuItem(lyr);
      _initMenuCheckbox(lyr, li);
      lyr.checkbox.on('change', activateDeactivateLayer);

      EnergyMaps.addLayerCanvas(lyr);
      EnergyMaps.addCanvasContext(lyr);

    }
  };

  /**
   * @description Sorts on array of objects based on the value of one key
   * so that the array's order matches the order of another array of values
   * @param {Array} sortArray The array to sort
   * @param {Array} targetArray The array to use as the order of sorting
   * @param {String} key The name of the key to sort by
   * @return {Array} The sorted array of objects
   * @memberof
   */
  const _sortOnTarget = function _sortOnTarget
    (sortArray, targetArray, key)
  {
    sortArray.sort( function (a, b) {
      let _a = a[key], _b = b[key];
      return (targetArray.indexOf(_a) > targetArray.indexOf(_b)) ? 1 : -1
    });
    return sortArray;
  };

  /**
   * @description Sort and redraw the layers of the map based on the order
   * of the map options. This function reorders both the LAYERS and
   * ACTIVE_LAYERS Arrays, and reorders the .map.layer <div>s in the page.
   * @return null
   * @memberof
   */
  const _sortMapLayers = function _sortMapLayers
    ()
  {
    const that = d3.select(this);
    let target = [];
    that.selectAll('.option-li input')
      .each(function (d, i) {
        target[i] = d3.select(this).node().getAttribute('data-layername');
        d3.select(`.map.layer.${d3.select(this).attr('data-layername')}`).lower();
      });
    d3.select('.base-map').lower();
    LAYERS = _sortOnTarget(LAYERS, target, 'name');
    ACTIVE_LAYERS = _sortOnTarget(ACTIVE_LAYERS, target, 'name');
  };

  const _drawDefaultLayers = function _drawDefaultLayers
    ()
  {
    let layers = [];
    if (localStorage.getItem('layers') === null) {
      layers.push(EnergyMaps.stateBoundaries);
    } else {
      let names = localStorage.getItem('layers').split(',');
      for (let i = LAYERS.length - 1; i >= 0; --i) {
        if (names.indexOf(LAYERS[i].name) > -1) {
          layers.push(LAYERS[i]);
        }
      }
    }
    layers.map(x => {
      document.querySelector(`.option-li input.${x.name}`).click();
    });
  };

  /**
   * @description Toggle the visibility of the options layer when the user
   * clicks on the 'triangle'
   * @return
   * @memberof
   */
  const _optionsToggle = function _optionsToggle
    ()
  {
    const options = d3.select('.options');
    (options.attr('data-toggle-state') === 'load')
    ? options.attr('data-toggle-state', 'close')
    : (options.attr('data-toggle-state') === 'open')
    ? options.attr('data-toggle-state', 'close')
    : options.attr('data-toggle-state', 'open');
  };

  d3.select('.options-toggle')
    .on('click', _optionsToggle);

  d3.selectAll('.checkbox')
    .on('mousedown', function () {
      d3.event.stopPropagation();
    });

  d3.select('.options-list ul')
    .on('stop', _sortMapLayers);

  // Initialize the options menu
  initMenu();

  // Draw the default layers of the map

  _drawDefaultLayers();

  EnergyMaps.initMenu = initMenu;
  EnergyMaps.showLayerAssetTotal = showLayerAssetTotal;

  return EnergyMaps;

})(EnergyMaps || {});