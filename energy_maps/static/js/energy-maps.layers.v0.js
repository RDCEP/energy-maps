EnergyMaps = (function (EnergyMaps) {

  'use strict';

  /**
   * @type {number}
   * @description the total sum of asset values for all active layers
   * @memberof Init
   */
  const _sumAssetTotals = function _sumAssetTotals
    ()
  {
    let assetTotalSum = 0;
    console.log(ACTIVE_LAYERS)
    for (let i = 0, l = ACTIVE_LAYERS.length; i < l; i++) {
      if (ACTIVE_LAYERS[i].name !== 'state-boundaries' &&
        ACTIVE_LAYERS[i].name !== 'wind-capacity')
      {
        // active layers value starts as undefined
        console.log(`active layers value ${ACTIVE_LAYERS[i].value[DATA_YEAR]}`)
        assetTotalSum += ACTIVE_LAYERS[i].value[DATA_YEAR];
      }
    }
    return assetTotalSum;
  }

  /**
   * Display total asset value of all active layers.
   * Currently using d3-format (https://github.com/d3/d3-format) for
   * currency formatting. Numeral.js (http://numeraljs.com/#format)
   * was previously used for currency formatting.
   * @memberof Init
   */
  const _displayAssetTotal = function _displayAssetTotal
    ()
  {
    // FIXME: This is a horrible kludge in order to get space before units.
    //  Need to write a proper formatter.
    document.getElementsByClassName('asset-total')[0]
      .innerHTML = `${d3.format('$.2~s')(_sumAssetTotals())
      .replace(/G/, ' B')
      .replace(/T/, ' T')}`;
  };

  const setLayers = function setLayers
    ()
  {

    if (LAYERS === null) {

      let _L = [];

      _L.push(EnergyMaps.stateBoundaries);

      // Coal
      _L.push(EnergyMaps.coalMine);
      _L.push(EnergyMaps.railroad);

      // AC
      _L.push(EnergyMaps.AcNaAndUnder100);
      _L.push(EnergyMaps.Ac100300);
      _L.push(EnergyMaps.Ac345735);

      // DC
      _L.push(EnergyMaps.dc);

      // Distribution
      _L.push(EnergyMaps.distribution);

      // Oil and Gas
      _L.push(EnergyMaps.gasWell);
      _L.push(EnergyMaps.oilWell);
      _L.push(EnergyMaps.foreignOilWells);
      _L.push(EnergyMaps.foreignGasWells);
      _L.push(EnergyMaps.gasPipeline);
      _L.push(EnergyMaps.oilPipeline);
      _L.push(EnergyMaps.oilProductPipeline);
      _L.push(EnergyMaps.oilRefinery);
      _L.push(EnergyMaps.gasProcessing);
      _L.push(EnergyMaps.oilAndGasStorage);

      // Plants
      _L.push(EnergyMaps.coalPlants);
      _L.push(EnergyMaps.naturalGasPlants);
      _L.push(EnergyMaps.petroleumPlants);
      _L.push(EnergyMaps.nuclearPlants);
      _L.push(EnergyMaps.hydroPlants);
      _L.push(EnergyMaps.windFarms);
      _L.push(EnergyMaps.solarPlants);
      _L.push(EnergyMaps.geothermalPlants);

      // TODO: push biofuel in when you have data with a valid scaling value
      _L.push(EnergyMaps.biofuel);
      // layers.push(bio_plants);

      _L.push(EnergyMaps.windMap);

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

  const _loadLayerData = function _loadLayerData
    (lyr)
  {
  if (lyr === EnergyMaps.oilPipeline) {
    let lyrs = [EnergyMaps.oilPipeline, EnergyMaps.oilProductPipeline];
    for (let i = 0, lyrs_length = lyrs.length; i < lyrs_length; ++i) {
      EnergyMaps.startLoadingLayer();
      // TODO: Figure out why prod pipes legend is no longer showing
      Promise.all(
        lyrs[i].drawProps[0].src.map(
          x => lyrs[i].drawProps[0].d3Fetch(
            `${API_URL_PREFIX}${x}`
          )))
        .then(function(files) {
          lyrs[i].context.restore();
          lyrs[i].context.save();
          return files;
        }).then(files => {
          EnergyMaps.transformLayer(lyrs[i].context, EnergyMaps.transform);
          console.time('drawLayer')
          lyrs[i].drawProps[0].drawLayer(lyrs[i].context, files);
          console.timeEnd('drawLayer')
          // console.log(lyr.draw_props[i].src)
          console.log(`${API_URL_PREFIX}${lyr.drawProps[0].src}`)
        });
    }
  } else {
      for (let i = 0, num_drawProps = lyr.drawProps.length; i < num_drawProps; ++i) {
        EnergyMaps.startLoadingLayer();
        if (lyr.name !== 'state-boundaries' && lyr.name !== 'wind-capacity') {
          // unused commented section for future reference
          // currently adding the entirety of the previous src string each time pressed
          // let url_string = `${API_URL_PREFIX}${lyr.draw_props[0].src[0]}`
          // lyr.draw_props[0].src[0] = `${API_URL_PREFIX}${lyr.draw_props[0].src[0]}`

          Promise.all(lyr.drawProps[i].src.map(x => lyr.drawProps[i].d3Fetch(
            `${API_URL_PREFIX}${x}`)))
          .then(function(files) {
            lyr.context.restore();
            lyr.context.save();
            return files;
          }).then(files => {
            EnergyMaps.transformLayer(lyr.context, EnergyMaps.transform);
            return files;
          }).then(files => {
            console.time('drawLayer');
            lyr.drawProps[i].drawLayer(lyr.context, files);
            console.timeEnd('drawLayer');
            console.log(`${API_URL_PREFIX}${lyr.drawProps[i].src}`);
          });
        }
        else {
          Promise.all(lyr.drawProps[i].src.map(x => lyr.drawProps[i].d3Fetch(x)))
          .then(function(files) {
            lyr.context.restore();
            lyr.context.save();
            return files;
          }).then(files => {
            EnergyMaps.transformLayer(lyr.context, EnergyMaps.transform);
            return files;
          }).then(files => {
            console.time('drawLayer');
            lyr.drawProps[i].drawLayer(lyr.context, files);
            console.timeEnd('drawLayer');
            console.log(`${API_URL_PREFIX}${lyr.drawProps[i].src}`);
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
    _loadLayerData(lyr, transform);
    console.timeEnd('load_layer_data');
    // lyr.draw_props[0].src[0] = `${API_URL_PREFIX}/power_plants/coal`
    lyr.active = true;
    if (lyr === EnergyMaps.oilPipeline) {
      EnergyMaps.oilProductPipeline.active = true;
    }
    ACTIVE_LAYERS.push(lyr);
    _displayAssetTotal();
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
    EnergyMaps.hideSpinner();
    lyr.context.clearRect(0, 0, EnergyMaps.width, EnergyMaps.height);
    lyr.active = false;
    if (lyr === EnergyMaps.oilPipeline) {
      EnergyMaps.oilProductPipeline.context.clearRect(0, 0, EnergyMaps.width, EnergyMaps.height);
      EnergyMaps.oilProductPipeline.active = false;
    }
    // active_layers.pop(lyr);
    // ACTIVE_LAYERS.indexOf(lyr);
    ACTIVE_LAYERS.splice(ACTIVE_LAYERS.indexOf(lyr), 1);
    _displayAssetTotal();
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
      .attr('width', EnergyMaps.width)
      .attr('height', EnergyMaps.height);
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

  const drawActiveLayers = function drawActiveLayers
    (transform)
  {
    const layers = EnergyMaps.setLayers();
    layers.map(layer => {
      if (layer.active === true) {
        console.time('load_layer_data');
        _loadLayerData(layer);
        console.timeEnd('load_layer_data');
      } else {
        layer.context.restore();
        layer.context.save();
        EnergyMaps.transformLayer(layer.context, EnergyMaps.transform);
      }
      return layer;
    });
  };

  LAYERS = setLayers();

  EnergyMaps.setLayers = setLayers;
  EnergyMaps.drawActiveLayers = drawActiveLayers;
  EnergyMaps.removeLayer = removeLayer;
  EnergyMaps.addLayer = addLayer;
  EnergyMaps.addLayerCanvas = addLayerCanvas;
  EnergyMaps.addCanvasContext = addCanvasContext;

  return EnergyMaps;

})(EnergyMaps || {});