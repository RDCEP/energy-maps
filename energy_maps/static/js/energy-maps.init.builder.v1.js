/**
* @file Initializes the application in the browser.
* @author Benjamin Kleeman
* @author Nathan Matteson
*/

EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

  /**
   * @type {string}
   * @description Sets the path for the base map
   * @memberof Init
   */
  const fmap = '../static/json/states-10m.json';

  /**
   * @type {string}
   * @description HTML class on which the main map is drawn
   * @memberof Init
   */
  const map_container = '.main-map';
  const base_map_class = '.base-map';

  /**
   *  @description A canvas element for the base map, attached to
   *  <div class="main map builder" id="mapcanvas">
   * @memberof Init
   */
  const base_canvas = d3
    .select(base_map_class)
    .append('canvas')
    .attr('id', 'mapcanvas')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);

  const ctx = base_canvas.node().getContext('2d');
  ctx.LineCap = 'round';

  /**
   * @type {Object}
   * @description HTML5 canvas for the application legend
   * @memberof Init
   */
  const legend_canvas = d3
    .select('.legend.canvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 0);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let legend_ctx = legend_canvas.node().getContext('2d');
  legend_ctx.lineCap = 'round';

  const legend_tmpcanvas = d3
    .select('.legend.tmpcanvas')
    .append('canvas')
    .attr('width', 400)
    .attr('height', 1000);

  /**
   * @type {Object}
   * @description HTML5 canvas context for the application legend
   * @memberof Init
   */
  let tmplegend_ctx = legend_tmpcanvas.node().getContext('2d');
  tmplegend_ctx.lineCap = 'round';

  /**
   * @type {number}
   * @description the total sum of asset values for all active layers
   * @memberof Init
   */
  // let asset_total_sum = 0;

  /**
   * @description Draw the base map for the application based off
   * of the data from fmap and fmapfill
   * @memberof Init
   */
  const _draw_base_map = function _draw_base_map(transform) {
    Promise.all(
      [d3.json(fmap)]
    ).then(function(files) {
      energy_maps.draw_land(ctx, files, transform, false, false);
    });
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


  const _sum_asset_totals = function _sum_asset_totals() {
    var asset_total_sum = 0;
    console.log(ACTIVE_LAYERS)
    for (let i = 0; i < ACTIVE_LAYERS.length; i++) {
      if (ACTIVE_LAYERS[i].name != 'state-boundaries' &&
        ACTIVE_LAYERS[i].name != 'wind-capacity')
      {
        // active layers value starts as undefined
        console.log(`active layers value ${ACTIVE_LAYERS[i].value[DATA_YEAR]}`)
        asset_total_sum += ACTIVE_LAYERS[i].value[DATA_YEAR];
      }
    }
    return asset_total_sum;
  }

  /**
   * Display total asset value of all active layers.
   * Currently using d3-format (https://github.com/d3/d3-format) for
   * currency formatting. Numeral.js (http://numeraljs.com/#format)
   * was previously used for currency formatting.
   * @memberof Init
   */
  const _display_asset_total = function _display_asset_total() {
    // FIXME: This is a horrible kludge in order to get space before units.
    //  Need to write a proper formatter.
    document.getElementsByClassName('asset-total')[0]
      .innerHTML = `${d3.format('$.2~s')(_sum_asset_totals())
      .replace(/G/, ' B')
      .replace(/T/, ' T')}`;
  };

  var layers_to_redraw = []
  var cboxes_to_check = []
  let unchanged_layers_2022 = []

  let create_year_button = function create_year_button
    (btn_val, year_val)
  {
    let btn = document.createElement("button");
    btn.innerHTML = `${btn_val}`;
    document.querySelector('.options-list h6')
      .appendChild(btn);
    btn.classList.add('btn-year');
    btn.addEventListener('click', function() {
      btn_val = btn_val;
      data_year = energy_maps.get_data_year(btn_val)
      // API_URL_PREFIX = `http://127.0.0.1:5000/api/v0.1.0/infrastructure/${DATA_YEAR}`

      // Add an asterisk if year is 2022
      if (DATA_YEAR === 2022) {
        initMenuAsteriskNote();
      } else if (DATA_YEAR === 2012) {
        energy_maps.asterisk_note[0].remove()
      }

      unchanged_layers_2022 = [
        energy_maps.gas_well, energy_maps.oil_well, energy_maps.railroad,
        energy_maps.ac_na_and_under_100, energy_maps.ac_100_300,
        energy_maps.ac_345_735, energy_maps.dc, energy_maps.gas_pipeline,
        energy_maps.oil_pipeline, energy_maps.oil_product_pipeline ];
      if (DATA_YEAR === 2022) {
        for (let i = 0; i < unchanged_layers_2022.length; i++) {
          unchanged_layers_2022[i].unchanged_2022 = true;
        }
      } else if (DATA_YEAR === 2012) {
        for (let i = 0; i < unchanged_layers_2022.length; i++) {
          unchanged_layers_2022[i].unchanged_2022 = false;
        }
      }

      // deactivate any layers that don't have data for specific years
      // try to store draw props in a variable to restore them
      // This may not be necessary at all rn, as we don't want to
      // deactivate any layers now
      let deactivated_layers_2022 = [
        energy_maps.gas_well, energy_maps.oil_well, energy_maps.railroad,
        energy_maps.ac_na_and_under_100, energy_maps.ac_100_300,
        energy_maps.ac_345_735, energy_maps.dc]
      let deactivated_draw_props = []

      // TODO: fix this
      for (let i = 0; i < deactivated_layers_2022; i++) {
        deactivated_draw_props.push(deactivated_layers_2022[i].draw_props[0])
      }
      console.log(`deactivated draw props: ${JSON.stringify(deactivated_draw_props)}`)

      // Need a function to toggle draw props
      // Need some way of storing original draw_props in a buffer
      // to use again later

      let toggle_draw_props = function toggle_draw_props(deactivated_layers) {
        if (DATA_YEAR === 2022) {
          for (let i = 0; i < deactivated_layers.length; i++) {
            deactivated_layers[i].draw_props = false;
          }
        } else if (DATA_YEAR === 2012) {
          for (let i = 0; i < deactivated_layers.length; i++) {
            deactivated_layers[i].draw_props = true;
          }
        }
      }

      // toggle_draw_props(deactivated_layers_2022)

      // empty the array of layers to redraw and cboxes_to_check

      layers_to_redraw = [];

      cboxes_to_check = [];

      // remove any layers from the previous cycle

      for (let i = 0; i < layers_to_redraw.length; i++) {
        _removeLayer(layers_to_redraw[i]);
      }

      let values = document.getElementsByClassName('asset-value');
      let asset_labels = document.getElementsByClassName('asset-label');
      let cboxes = document.getElementsByClassName('checkbox');

      for (let i = 0; i < cboxes.length; i++) {
        if (cboxes[i].checked) {
          cboxes_to_check.push(cboxes[i]);
        }
      }

      // populate array with layers to redraw and
      // remove current layers from the screen
      // for (let i = 0; i < layers.length; i++) {
      //   if (layers[i].active) {
      //     layers_to_redraw.push(layers[i])
      //     removeLayer(layers[i], transform)
      //   }
      // }

      // // redraw layers
      // for (let i = 0; i < layers_to_redraw.length; i++) {
      //   addLayer(layers_to_redraw[i], transform)
      // }

      layers = layers.map(x => {
        if (x.active) {
          console.log(x);
          _removeLayer(x, TRANSFORM);
          // addLayer(x, transform);
        }
        return x
      })

      var labels = document.getElementsByTagName('label');
      for (let i = 0; i < labels.length; i++) {
        labels[i].classList.add('asset-label')
      }

      // remove asset values, asset labels, and checkboxes
      for (let i = 0; i < layers.length; i++) {

        for (let i = 0; i < values.length; i++) {
          values[i].remove();
        }

        for (let i = 0; i < asset_labels.length; i++) {
          asset_labels[i].remove();
        }

        for (let i = 0; i < cboxes.length; i++) {
          cboxes[i].remove();
        }

      }

      // for (let i = 0; i < active_layers.length; i++) {
      //   active_layers[i].remove();
      // }

      // redraw the menu and reactivate draw functions
      _initMenu();

      // re-check the box on redraw
      for (let i = 0; i < cboxes_to_check.length; i++) {
        var cb = document.getElementsByClassName(`${cboxes_to_check[i].classList}`)[0];
        cb.click();
        cb.checked = true;
      }

      console.table(layers_to_redraw);
      console.log(layers_to_redraw);
      console.table(cboxes_to_check);
      console.log(cboxes_to_check);
      console.table(active_layers);
      console.log(active_layers);

      // let state_boundaries_asset_value = document.getElementsByClassName('state-boundaries')[4].children[0]
      // state_boundaries_asset_value.remove()


      console.log(DATA_YEAR);
      document.getElementById("value-year")
        .innerHTML = `out of ${year_val} in ${btn_val}`;
    });
  }


  create_year_button(2012, "$9.8T");
  create_year_button(2022, "$9.8T");

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
   * @description Call all draw methods for a given layer and render it
   * to its canvas element. Uses a recursive call in special cases.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */

  const _load_layer_data = function _load_layer_data
    (lyr)
  {
  if (lyr === energy_maps.oil_pipeline) {
    let lyrs = [energy_maps.oil_pipeline, energy_maps.oil_product_pipeline];
    for (let i = 0, lyrs_length = lyrs.length; i < lyrs_length; ++i) {
      energy_maps.start_loading_layer();
      // TODO: Figure out why prod pipes legend is no longer showing
      Promise.all(
        lyrs[i].draw_props[0].src.map(
          x => lyrs[i].draw_props[0].d3_fetch(
            `${API_URL_PREFIX}${x}`
          )))
        .then(function(files) {
          lyrs[i].context.restore();
          lyrs[i].context.save();
          return files;
        }).then(files => {
          energy_maps.transform_layer(lyrs[i].context, TRANSFORM);
          console.time('draw_layer')
          lyrs[i].draw_props[0].draw_layer(lyrs[i].context, files);
          console.timeEnd('draw_layer')
          // console.log(lyr.draw_props[i].src)
          console.log(`${API_URL_PREFIX}${lyr.draw_props[0].src}`)
        });
    }
  } else {
      for (let i = 0, num_draw_props = lyr.draw_props.length; i < num_draw_props; ++i) {
        energy_maps.start_loading_layer();
        if (lyr.name != 'state-boundaries' && lyr.name != 'wind-capacity') {
          // unused commented section for future reference
          // currently adding the entirety of the previous src string each time pressed
          // let url_string = `${API_URL_PREFIX}${lyr.draw_props[0].src[0]}`
          // lyr.draw_props[0].src[0] = `${API_URL_PREFIX}${lyr.draw_props[0].src[0]}`

          Promise.all(lyr.draw_props[i].src.map(x => lyr.draw_props[i].d3_fetch(
            `${API_URL_PREFIX}${x}`)))
          .then(function(files) {
            lyr.context.restore();
            lyr.context.save();
            return files;
          }).then(files => {
            energy_maps.transform_layer(lyr.context, TRANSFORM);
            return files;
          }).then(files => {
            console.time('draw_layer');
            lyr.draw_props[i].draw_layer(lyr.context, files);
            console.timeEnd('draw_layer');
            console.log(`${API_URL_PREFIX}${lyr.draw_props[i].src}`);
          });
        }
        else {
          Promise.all(lyr.draw_props[i].src.map(x => lyr.draw_props[i].d3_fetch(x)))
          .then(function(files) {
            lyr.context.restore();
            lyr.context.save();
            return files;
          }).then(files => {
            energy_maps.transform_layer(lyr.context, TRANSFORM);
            return files;
          }).then(files => {
            console.time('draw_layer');
            lyr.draw_props[i].draw_layer(lyr.context, files);
            console.timeEnd('draw_layer');
            console.log(`${API_URL_PREFIX}${lyr.draw_props[i].src}`);
          });
        }
      }
    }
  };
  // Cleanest refactored version
  // const load_layer_data = function load_layer_data(lyr) {
  //   for (let i = 0; i < lyr.draw_props.length; ++i) {
  //     Promise.all(lyr.draw_props[0].src.map(x => lyr.draw_props[0].d3_fetch(x)))
  //     .then(files => {
  //       lyr.context.restore();
  //       lyr.context.save();
  //       return files;
  //     }).then(files => {
  //       transform_layer(lyr.context, transform);
  //       return files;
  //     }).then(files => {
  //       lyr.draw_props[0].draw_layer(lyr.context, files);
  //     });

  //     if (lyr.draw_props.length > 1) {
  //       load_layer_data(lyr.draw_props[0].next_layer)
  //     }
  //   }
  // }

  // Original version from before refactor --
  // keeping this in case the lyr.draw_props.next_layer thing above doesn't work

  // const load_layer_data = function load_layer_data(lyr) {
  //   if (lyr === oil_pipeline) {
  //     let lyrs = [oil_pipeline, oil_product_pipeline];
  //     for (let i = 0; i < lyrs.length; ++i) {
  //       start_loading_layer();
  //       Promise.all(lyrs[i].draw[0].src.map(x => lyrs[i].draw[0].w(x)))
  //         .then(function(files) {
  //           lyrs[i].context.restore();
  //           lyrs[i].context.save();
  //           return files;
  //         }).then(files => {
  //           transform_layer(lyrs[i].context, transform);
  //           lyrs[i].draw[0].f(lyrs[i].context, files);
  //         });
  //     }
  //   } else {
  //       for (let i = 0; i < lyr.draw.length; ++i) {
  //         start_loading_layer();
  //         Promise.all(lyr.draw[i].src.map(x => lyr.draw[i].w(x)))
  //           .then(function(files) {
  //             lyr.context.restore();
  //             lyr.context.save();
  //             return files;
  //           }).then(files => {
  //             transform_layer(lyr.context, transform);
  //             return files
  //           }).then(files => {
  //             lyr.draw[i].f(lyr.context, files);
  //           });
  //       }
  //   }
  // };

  LAYERS.push(energy_maps.state_boundaries);

  // Coal
  LAYERS.push(energy_maps.coal_mine);
  LAYERS.push(energy_maps.railroad);

  // AC
  LAYERS.push(energy_maps.ac_na_and_under_100);
  LAYERS.push(energy_maps.ac_100_300);
  LAYERS.push(energy_maps.ac_345_735);

  // DC
  LAYERS.push(energy_maps.dc);

  // Distribution
  LAYERS.push(energy_maps.distribution);

  // Oil and Gas
  LAYERS.push(energy_maps.gas_well);
  LAYERS.push(energy_maps.oil_well);
  LAYERS.push(energy_maps.foreign_oil_wells);
  LAYERS.push(energy_maps.foreign_gas_wells);
  LAYERS.push(energy_maps.gas_pipeline);
  LAYERS.push(energy_maps.oil_pipeline);
  LAYERS.push(energy_maps.oil_product_pipeline);
  LAYERS.push(energy_maps.oil_refinery);
  LAYERS.push(energy_maps.gas_processing);
  LAYERS.push(energy_maps.oil_and_gas_storage);

  // Plants
  LAYERS.push(energy_maps.coal_plants);
  LAYERS.push(energy_maps.ng_plants);
  LAYERS.push(energy_maps.pet_plants);
  LAYERS.push(energy_maps.nuc_plants);
  LAYERS.push(energy_maps.hyc_plants);
  LAYERS.push(energy_maps.wnd_farms);
  LAYERS.push(energy_maps.solar_plants);
  LAYERS.push(energy_maps.geo_plants);

  // TODO: push biofuel in when you have data with a valid scaling value
  LAYERS.push(energy_maps.biofuel);
  // layers.push(bio_plants);

  LAYERS.push(energy_maps.wind_map);

  let lay = LAYERS.length;
  // TODO: Why is this here? Shouldn't it be passed to funcs as we
  // create checkboxes?
  let checkbox_span;

  /**
   * @description An array of named objects representing button column names to
   * be shown at the top of the checkbox selection menu.
   * @property {string} name - an HTML/CSS ID that will be assigned to the
   * markup dynamically and ultimately formatted for case and plain-English
   * spacing to label the columns.
   * @memberof Init
   */
  const button_columns = [
    [{ name: 'oil-and-gas',
       text: 'Oil and gas'
    }],
    [{ name: 'coal',
       text: 'Coal'
    },
    {  name: 'layers',
       text: 'Layers'
    }],
    [{ name: 'electricity-generation',
       text: 'Electricity generation'
    }],
    [{ name: 'electricity-transmission-and-distribution',
       text: 'Electricity trans. & dist.'
    }],
  ];

  let cols = button_columns.length;

  /**
   * @description Initialize and display all menu columns that divide
   * checkboxes into categories.
   * @memberof Init
   * TODO: We're no longer using columns in the new design. Remove this.
   */
  const initMenuColumns = function initMenuColumns
    ()
  {
    for (let i = 0; i < cols; ++i) {
      let column_divs = d3.select('.options.canvas')
        .append('div')
        .attr('class', () => {return `column`});
      for (let j = 0; j < button_columns[i].length; j++) {
        let col = button_columns[i][j];
        column_divs.append('div')
          .attr('class', () => { return `${col.name}`})
          .append('h4')
          .text(col.text);
      }
    }
  };

  const initMenuAsteriskNote = function initMenuAsteriskNote
    ()
  {
    let note_div = d3.select('.options.canvas')
      .append('div')
      .attr('class', () => {return 'column asterisk-note'})
      .append('h4')
      .text('* 2012 asset values used');
  }

  /**
   * @description Add a layer to the screen.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const _addLayer = function _addLayer
    (lyr, transform)
  {
    console.time('load_layer_data');
    _load_layer_data(lyr, transform);
    console.timeEnd('load_layer_data');
    // lyr.draw_props[0].src[0] = `${API_URL_PREFIX}/power_plants/coal`
    lyr.active = true;
    if (lyr === energy_maps.oil_pipeline) {
      energy_maps.oil_product_pipeline.active = true;
    }
    ACTIVE_LAYERS.push(lyr);
    _display_asset_total();
    return ACTIVE_LAYERS;
  };

  /**
   * @description Remove a layer from the screen.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const _removeLayer = function _removeLayer
    (lyr)
  {
    energy_maps.hide_spinner();
    lyr.context.clearRect(0, 0, WIDTH, HEIGHT);
    lyr.active = false;
    if (lyr === energy_maps.oil_pipeline) {
      energy_maps.oil_product_pipeline.context.clearRect(0, 0, WIDTH, HEIGHT);
      energy_maps.oil_product_pipeline.active = false;
    }
    // active_layers.pop(lyr);
    // ACTIVE_LAYERS.indexOf(lyr);
    ACTIVE_LAYERS.splice(ACTIVE_LAYERS.indexOf(lyr), 1);
    _display_asset_total();
  };

  // initMenuColumns();
  // initMenuAsteriskNote();

  // Generate UI element for checkbox columns

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
      .attr('class', 'option-li');
    li.append('div')
      .attr('uk-icon', 'icon: list')
      .attr('class', 'drag uk-sortable-handle');
      // .attr('uk-icon', true)
      // .attr('data-icon', 'list')
      // .attr('class', 'drag uk-sortable-handle');
    let label = li.append('label')
      .attr('class', () => {
        return (!lyr.draw_props || lyr === energy_maps.oil_product_pipeline)
          ? `${lyr.name} inactive` : `${lyr.name}`
    });
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
   * @return {Object} checkbox_span - an HTML5 span tag with that displays
   * total asset value for the menu item.
   * abbreviated in either billions or trillions. Child of a parent label tag.
   * @memberof Init
   */
  const _initMenuAssetValue = function _initMenuAssetValue
    (lyr, label)
  {
    if (lyr.value[DATA_YEAR] != 0
      && lyr.name != 'state-boundaries'
      && lyr.name != 'wind-capacity'
      && lyr.name != 'oil-product-pipelines')
    {
      label.append('span')
        .attr('class', 'asset-value')
        // FIXME: This is a horrible kludge in order to get space before units.
        //  Need to write a proper formatter.
        .text(` ($${_capitalize_first_letter(
          d3.format('.2~s')(lyr.value[DATA_YEAR])
            .replace(/G/, ' B')
            .replace(/T/, ' T'))})`);
      if (lyr.unchanged_2022 == true) {
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
    if (!(lyr.draw_props && (lyr != energy_maps.oil_product_pipeline))) {
      lyr.checkbox.attr('disabled', true);
    }
    return lyr.checkbox;
  };

  /**
   * @description Generate a canvas in the DOM for a given layer.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const _addLayerCanvas = function _addLayerCanvas
    (lyr)
  {
    lyr.canvas = d3
      .select(map_container)
      .append('div')
      .attr('class', `map layer ${lyr.name}`)
      // .attr('uk-cover', true)
      .append('canvas')
      .attr('class', `canvas ${lyr.name}`)
      .attr('width', WIDTH)
      .attr('height', HEIGHT);
  };

  /**
   * @description Generate a canvas context in the DOM for a given layer.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const _addCanvasContext = function _addCanvasContext
    (lyr)
  {
    lyr.context = lyr.canvas.node().getContext('2d');
    lyr.context.lineCap = 'round';
    lyr.active = false;
  };

  let _initMenu = function _initMenu
    ()
  {
    for (let i = 0; i < lay; i++) {

      let lyr = LAYERS[i];
      
      let li = _initMenuItem(lyr);
      _initMenuCheckbox(lyr, li);
      lyr.checkbox.on('change', function() {

        // checkbox is buried in a ut {} object for some reason
        let checkbox = lyr.checkbox._groups[0][0];

        if (checkbox.checked) {
          _addLayer(lyr, TRANSFORM);
        } else {
          _removeLayer(lyr, TRANSFORM);
        }
        // if (!(lyr instanceof StateBoundary)) {
        if (!(lyr.name == 'state-boundaries')) {
          legend_ctx.clearRect(0, 0, WIDTH, HEIGHT);
          tmplegend_ctx.clearRect(0, 0, WIDTH, HEIGHT);
          energy_maps.update_legend(tmplegend_ctx, legend_ctx, LAYERS);
          if (ACTIVE_LAYERS.length === 0) {
            energy_maps.legend.hidden = true;
          }
        }
      });

      if (lyr.draw_props && (lyr != energy_maps.oil_product_pipeline)) { // TODO: What a horrible way of checking for one corner case of which we have several
                                                       // There are now multiple objects that need to be rendered in the menu but need to be grey
                                                       // and also have no checkbox. We can't rely on lyr.draw === true anymore. Each obj should
                                                       // probably have a property that determines whether it gets a checkbox or not...
                                                       // like `obj.requires_checkbox = false` or something like that.

      }

      _addLayerCanvas(lyr);
      _addCanvasContext(lyr);

    }
  };

  _initMenu();

  // Load base map and any layers you want on by default

  _draw_base_map(TRANSFORM);
  _addLayer(energy_maps.state_boundaries, TRANSFORM);
  let state_boundaries_checkbox = document.getElementsByClassName('state-boundaries')[3];
  state_boundaries_checkbox.checked = true;

  const _target_canvas = d3.select('.map.layer.zoom-target');

  let prev_k = TRANSFORM.k;

  const _zoom_start = function _zoom_start
    ()
  {
    console.log('zoom start');
    prev_k = TRANSFORM.k;
    LAYERS = LAYERS.map(layer => {
        layer.context.clearRect(0, 0, WIDTH, HEIGHT);
        return layer;
      }
    );
    TRANSFORM = d3.event.transform;
  };

  const _zoomed = function _zoomed
    ()
  {
    TRANSFORM = d3.event.transform;
    energy_maps.draw_land(ctx, [energy_maps.simple_map_bkgd], TRANSFORM, false, true);
  };

  const _zoom_end = _.debounce(function(e) {
    energy_maps.k_changed = TRANSFORM.k != prev_k;
    _draw_base_map(TRANSFORM);
    _draw_active_layers(TRANSFORM);
  }, 500, false);

  const _zoom = d3.zoom()
    .scaleExtent([0, 50])
    .on('start', _zoom_start)
    .on('zoom', _zoomed)
    .on('end', _zoom_end);

  _target_canvas.call(_zoom);

  d3.select('.zoom-in').on('click', function() {
    let increment = .1;
    let k = TRANSFORM.k + increment;
    let x = (
      TRANSFORM.x + energy_maps.projection_width * (TRANSFORM.k - k) / 2) / k;
    let y = (
      TRANSFORM.y + energy_maps.projection_height * (TRANSFORM.k - k) / 2) / k;
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x, y);
    _target_canvas.call(_zoom.transform, initial_transform);
  });

  d3.select('.zoom-out').on('click', function() {
    let increment = .1;
    let k = TRANSFORM.k - increment;
    let x = (
      TRANSFORM.x + energy_maps.projection_width * (TRANSFORM.k - k) / 2)
      / k + TRANSFORM.x;
    let y = (
      TRANSFORM.y + energy_maps.projection_height * (TRANSFORM.k - k) / 2)
      / k + TRANSFORM.y;
    let initial_transform = d3.zoomIdentity
      .scale(k)
      .translate(x - TRANSFORM.x, y - TRANSFORM.y);
    _target_canvas.call(_zoom.transform, initial_transform);
  });

  // FIXME: This probably doesn't belong here in the code.
  // From: https://stackoverflow.com/questions/41607804/promise-each-without-bluebird
  Promise.each = function(arr, fn) { // take an array and a function
    // invalid input
    if (!Array.isArray(arr)) {
      return Promise.reject(new Error("Non array passed to each"));
    }
    // empty case
    if (arr.length === 0) {
      return Promise.resolve();
    }
    return arr.reduce(function(prev, cur) {
      return prev.then(() => fn(cur))
    }, Promise.resolve());
  };

  let _draw_active_layers = function _draw_active_layers
    (transform)
  {
    LAYERS = LAYERS.map(layer => {
      if (layer.active == true) {
        console.time('load_layer_data');
        _load_layer_data(layer, TRANSFORM);
        console.timeEnd('load_layer_data');
      } else {
        layer.context.restore();
        layer.context.save();
        energy_maps.transform_layer(layer.context, TRANSFORM);
      }
      return layer;
    });
  };

  const _window_resize = _.debounce(function(e) {
    WIDTH = window.innerWidth * SCALE;
    HEIGHT = window.innerHeight * SCALE;
    console.log('resize', WIDTH, HEIGHT)
    base_canvas
      .attr('width', WIDTH)
      .attr('height', HEIGHT);
    LAYERS = LAYERS.map(x => {
      x.canvas
        .attr('width', WIDTH)
        .attr('height', HEIGHT);
      x.context.clearRect(0, 0, WIDTH, HEIGHT);
      return x;
    });
    _draw_base_map(TRANSFORM);
    _draw_active_layers(TRANSFORM);
  }, 500, false);

  d3.select(window).on('resize', _window_resize);

  function fix_dpi(canvas) {
    // get height and width of a canvas as an integer (slice to remove 'px')
    let style_height = +getComputedStyle(canvas)
      .getPropertyValue('height').slice(0, -2);
    let style_width = +getComputedStyle(canvas)
      .getPropertyValue('width').slice(0, -2);
    d3.select(canvas)
      .attr('height', style_height * dpi)
      .attr('width', style_width * dpi);
  }

  const toggles = d3.selectAll('.window .toggle');

  toggles.on('click', function() {
    let closed = d3.select(this).classed('open');
    // Toggle legend visibility
    d3.select(this.parentNode).select('.canvas')
      .classed('closed', closed)
      .classed('closed', !closed);
    // Toggle state of visibility icon
    d3.select(this)
      .classed('open', !closed)
      .classed('close', closed);
  });

  toggles.on('mousedown', function() {
    d3.event.stopPropagation();
  });

  const window_drag_started = function window_drag_started
    ()
  {
    d3.event.on('drag', dragged).on('end', ended);

    function dragged() {
      let that = d3.select(this);
      that
        .style('bottom', null)
        .style('right', `${
          parseInt(that.style('right'), 10) - d3.event.dx}px`)
        .style('top', function() {
          let y = parseInt(that.style('top'), 10);
          if (y > HEIGHT - 50) {
            return `${HEIGHT - 50}px`;
          }
          return `${y + d3.event.dy}px`;
        });
    }

    function ended() {
      //
    }
  }

  d3.selectAll('.window.menu')
    // Set horizontal position of draggable windows on page load.
    .style('right', function() { if (d3.select(this).classed('legend')) {
      return `${(WIDTH-1200)/2+100}px`;
    } else if (d3.select(this).classed('options')) {
      return `${(WIDTH-950)/2}px`;
    }})
    // Set vertical position of legend on page load.
    .style('top', function() { if (d3.select(this).classed('legend')) {
      let header_height = d3.select('header').node().offsetHeight;
      return `${header_height}px`;
    }})
    .call(d3.drag().on('start', window_drag_started));

  d3.selectAll('.window .canvas')
    .call(d3.drag().on('start', function () {
      d3.event.stopPropagation();
    }));

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
    _draw_active_layers(TRANSFORM);
  });

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);