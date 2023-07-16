EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

  /**
   * @param  {String} s - the supplied character string to be formatted
   * @returns {String} the supplied string with the first letter capitalized
   * @memberof Init
   */
  const _capitalize_first_letter = function _capitalize_first_letter
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
      .attr('class', () => {
        return (!lyr.draw_props || lyr === energy_maps.oil_product_pipeline)
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
          : `${_capitalize_first_letter(lyr.name
            .replace(/ /g, '\u00A0') // Replacing a normal space with nbsp;
            .replace(/-/g, '\u00A0'))}\u00A0`
      })

    return label;
  };

  /**
   * @description Generate an asset value for a checkbox in the menu.
   * @param {Object} lyr - An object from layers[].
   * @param {Object} label
   * @return {Object} checkbox_span - an HTML5 span tag with that displays
   * total asset value for the menu item.
   * abbreviated in either billions or trillions. Child of a parent label tag.
   * @memberof Init
   */
  const _initMenuAssetValue = function _initMenuAssetValue
    (lyr, label)
  {
    if (lyr.value[DATA_YEAR] !== 0
      && lyr.name !== 'state-boundaries'
      && lyr.name !== 'wind-capacity'
      && lyr.name !== 'oil-product-pipelines')
    {
      label.append('span')
        .attr('class', 'asset-value')
        // FIXME: This is a horrible kludge in order to get space before units.
        //  Need to write a proper formatter.
        .text(` ($${_capitalize_first_letter(
          d3.format('.2~s')(lyr.value[DATA_YEAR])
            .replace(/G/, ' B')
            .replace(/T/, ' T'))})`);
      if (lyr.unchanged_2022 === true) {
        label.append('span')
          .text(' *')
      }

    }
    label.append('span')
      .attr('class', 'leader');
    return label;
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
    label = _initMenuAssetValue(lyr, label);
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
      .attr('data-assetvalue', lyr.value[DATA_YEAR]);
    if (!(lyr.draw_props && (lyr !== energy_maps.oil_product_pipeline))) {
      lyr.checkbox.attr('disabled', true);
    }
    return lyr.checkbox;
  };

  const initMenu = function initMenu
    ()
  {
    const layers = energy_maps.set_layers();
    // for (let i = 0; i < LAYERS.length; i++) {
    for (let i = 0, l = layers.length; i < l; i++) {

      let lyr = layers[i];

      let li = _initMenuItem(lyr);
      _initMenuCheckbox(lyr, li);
      lyr.checkbox.on('change', function() {

        // checkbox is buried in a ut {} object for some reason
        let checkbox = lyr.checkbox._groups[0][0];

        if (checkbox.checked) {
          energy_maps.addLayer(lyr, TRANSFORM);
        } else {
          energy_maps.removeLayer(lyr);
        }
        // if (!(lyr instanceof StateBoundary)) {
        if (!(lyr.name === 'state-boundaries')) {
          energy_maps.legend_ctx.clearRect(0, 0, WIDTH, HEIGHT);
          energy_maps.tmplegend_ctx.clearRect(0, 0, WIDTH, HEIGHT);
          energy_maps.update_legend(energy_maps.tmplegend_ctx, energy_maps.legend_ctx, LAYERS);
          if (ACTIVE_LAYERS.length === 0) {
            energy_maps.legend.hidden = true;
          }
        }
      });

      energy_maps.addLayerCanvas(lyr);
      energy_maps.addCanvasContext(lyr);

    }
  };

  const _sort_on_taget = function _sort_on_taget
    (sort_array, target_array, key)
  {
    sort_array.sort( function (a, b) {
      let _a = a[key], _b = b[key];
      return (target_array.indexOf(_a) > target_array.indexOf(_b)) ? 1 : -1
    });
    return sort_array;
  };

  d3.selectAll('.checkbox')
    .on('mousedown', function () {
      d3.event.stopPropagation();
    });

  d3.select('.options-list ul').on('stop', function() {
    const that = d3.select(this);
    let target = [];
    let options = that.selectAll('.option-li input')
      .each(function (d, i) {
        target[i] = d3.select(this).node().getAttribute('data-layername')
      });
    LAYERS = _sort_on_taget(LAYERS, target, 'name');
    energy_maps.draw_active_layers(TRANSFORM);
  });

  initMenu();

  const DEFAULT_LAYERS = [energy_maps.state_boundaries];

  DEFAULT_LAYERS.map(x => {
    document.querySelector(`.option-li input.${x.name}`).click();
  });

  energy_maps.initMenu = initMenu;

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);