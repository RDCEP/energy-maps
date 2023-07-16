EnergyMaps = (function (energy_maps, InfrastructureSet) {

  'use strict';

  /**
   * @type {number}
   * @description the total sum of asset values for all active layers
   * @memberof Init
   */
  const _sum_asset_totals = function _sum_asset_totals() {
    var asset_total_sum = 0;
    console.log(ACTIVE_LAYERS)
    for (let i = 0, l = ACTIVE_LAYERS.length; i < l; i++) {
      if (ACTIVE_LAYERS[i].name !== 'state-boundaries' &&
        ACTIVE_LAYERS[i].name !== 'wind-capacity')
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

  const set_layers = function set_layers
    ()
  {

    if (LAYERS === null) {

      let _L = [];

      _L.push(energy_maps.state_boundaries);

      // Coal
      _L.push(energy_maps.coal_mine);
      _L.push(energy_maps.railroad);

      // AC
      _L.push(energy_maps.ac_na_and_under_100);
      _L.push(energy_maps.ac_100_300);
      _L.push(energy_maps.ac_345_735);

      // DC
      _L.push(energy_maps.dc);

      // Distribution
      _L.push(energy_maps.distribution);

      // Oil and Gas
      _L.push(energy_maps.gas_well);
      _L.push(energy_maps.oil_well);
      _L.push(energy_maps.foreign_oil_wells);
      _L.push(energy_maps.foreign_gas_wells);
      _L.push(energy_maps.gas_pipeline);
      _L.push(energy_maps.oil_pipeline);
      _L.push(energy_maps.oil_product_pipeline);
      _L.push(energy_maps.oil_refinery);
      _L.push(energy_maps.gas_processing);
      _L.push(energy_maps.oil_and_gas_storage);

      // Plants
      _L.push(energy_maps.coal_plants);
      _L.push(energy_maps.ng_plants);
      _L.push(energy_maps.pet_plants);
      _L.push(energy_maps.nuc_plants);
      _L.push(energy_maps.hyc_plants);
      _L.push(energy_maps.wnd_farms);
      _L.push(energy_maps.solar_plants);
      _L.push(energy_maps.geo_plants);

      // TODO: push biofuel in when you have data with a valid scaling value
      _L.push(energy_maps.biofuel);
      // layers.push(bio_plants);

      _L.push(energy_maps.wind_map);

      return _L;

    }

    return LAYERS;

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
        if (lyr.name !== 'state-boundaries' && lyr.name !== 'wind-capacity') {
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

  /**
   * @description Add a layer to the screen.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const addLayer = function addLayer
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
  const removeLayer = function removeLayer
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

  // initMenuAsteriskNote();

  /**
   * @description Generate a canvas in the DOM for a given layer.
   * @param {Object} lyr - An object from layers[].
   * @memberof Init
   */
  const addLayerCanvas = function addLayerCanvas
    (lyr)
  {
    lyr.canvas = d3
      // .select(map_container)
      .select('.main-map')
      .append('div')
      .attr('class', `map layer ${lyr.name}`)
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
  const addCanvasContext = function addCanvasContext
    (lyr)
  {
    lyr.context = lyr.canvas.node().getContext('2d');
    lyr.context.lineCap = 'round';
    lyr.active = false;
  };

  const draw_active_layers = function draw_active_layers
    (transform)
  {
    const layers = energy_maps.set_layers();
    layers.map(layer => {
      if (layer.active === true) {
        console.time('load_layer_data');
        _load_layer_data(layer);
        console.timeEnd('load_layer_data');
      } else {
        layer.context.restore();
        layer.context.save();
        energy_maps.transform_layer(layer.context, TRANSFORM);
      }
      return layer;
    });
  };

  LAYERS = set_layers();

  energy_maps.set_layers = set_layers;
  energy_maps.draw_active_layers = draw_active_layers;
  energy_maps.removeLayer = removeLayer;
  energy_maps.addLayer = addLayer;
  energy_maps.addLayerCanvas = addLayerCanvas;
  energy_maps.addCanvasContext = addCanvasContext;

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);