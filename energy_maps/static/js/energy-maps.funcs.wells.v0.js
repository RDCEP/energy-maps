/**
 * @file Provides global draw functions and any helpers for gas & oil wells,
 * pipelines, refineries, processing, and storage.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Wells
 */

EnergyMaps = (function (EnergyMaps) {

  'use strict';

  /**
   * Instantiates a new Well object that contains properties used to draw gas
   * and oil wells to the map and legend.
   * @class
   * @classdesc Used to create objects that represent gas and oil well
   * infrastructure.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} drawProps - properties used to parse the data and render
   * the visualization
   * @param {String} color - rgba value
   * @param {String} legendColor - rgba value
   * @property {Number} width - scaled value for symbols on the map
   * @property {Number} cross - scaled value for cross symbols on the map
   * @property {Number} diameter - scaled value for circular symbols on the map
   * @property {Number} stroke - stroke width
   */
  let Well = function Well
    (name, text, value, column, drawProps,
     color, legendColor)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.color = color;
    this.legendColor = legendColor;
    this.width = SCALE / 6;
    this.cross = 5 * SCALE;
    this.diameter = SCALE / 2;
    this.stroke = SCALE;
    this.zIndex = 0;
    /**
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @returns {Number} y - updated y axis
     */
    this.drawLegend = function drawWellLegend(ctx, x, y) {

      y = EnergyMaps.advanceVerticalIncrement(y, ctx, this.color, this.stroke);
      EnergyMaps.drawCircle(ctx, [x, y], this.diameter * 4);
      ctx.stroke();
      ctx.fill();
      ctx.lineWidth = oilAndGas.wells.stroke * 2;
      y = EnergyMaps.advanceForType(y, ctx, this.text, TEXT_OFFSET, x);
      y = EnergyMaps.advanceVerticalIncrement(y, ctx, this.color, oilAndGas.wells.stroke);
      EnergyMaps.drawX(ctx, [x, y], oilAndGas.wells.cross * 1.5);
      ctx.stroke();

      let text = `${this.text.slice(0, 3)} offshore wells`;
      y = EnergyMaps.advanceForType(y, ctx, text, TEXT_OFFSET, x);

      return y;
    };
  }
  Well.prototype = new EnergyMaps.InfrastructureSet;

  /**
   * Instantiates a new Transport object that contains properties used to draw
   * gas and oil pipelines to the map and legend.
   * @class
   * @classdesc Used to create objects that represent gas and oil pipeline
   * infrastructure.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} drawProps - properties used to parse the data and render
   * the visualization
   * @param {String} stroke - rgba value
   * @param {Number} width - scaled value for symbols on the map
   */
  let Transport = function Transport
    (name, text, value, column, drawProps,
     stroke, width)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.stroke = stroke;
    this.width = width;
    this.zIndex = 0;
    /**
     * Draw pipeline legend to its HTML5 canvas context. All params passed
     * to draw_line() as a helper.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @param {boolean} dashed - true if line should be dashed, false if solid
     * @returns {Number} y - updated y axis
     */
    this.drawLegend = function draw_pipeline_legend(ctx, x, y, dashed) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      let text = this.text;
      y = EnergyMaps.drawLine(ctx, x, y, this, dashed, text);
      return y;
    };
  }
  Transport.prototype = new EnergyMaps.InfrastructureSet;

  /**
   * Instatiates a new Processing object that contains properties used
   * to draw resource processing infrastructure to the map and legend.
   * @class
   * @classdesc Used to create objects that represent resource processing
   * infrastructure.
   * @extends InfrastructureSet
   * @param {String} name - canvas ID
   * @param {String} text - text displayed in the legend
   * @param {Number} value - asset value in USD
   * @param {String} column - class attribute for corresponding column
   * @param {Array} drawProps - properties used to parse the data and render
   * the visualization
   * @param {String} fill - rgba value
   * @param {Number} size - scaled value for symbols on the map
   * @property {String} stroke - stroke color
   * @property {Number} strokeWidth - stroke width
   */
  let Processing = function Processing
    (name, text, value, column, drawProps,
     fill, size)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.fill = fill;
    this.size = size;
    this.stroke = 'rgba(255, 255, 255, 1)';
    this.strokeWidth = SCALE * .75;
    this.zIndex = 0;
    /**
     * Draw gas processing legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @returns {Number} y - updated y axis
     */
    this.drawLegend = function drawProcessingLegend(ctx, x, y) {
      // Advance vertical increment
      y += VERTICAL_INCREMENT;
      _drawGasProcessor(ctx, [x, y], 5);
      let text = this.text;
      y = EnergyMaps.advanceForType(y, ctx, text, TEXT_OFFSET, x);
      return y;
    };
  }
  Processing.prototype = new EnergyMaps.InfrastructureSet;

  let Refinery = function Refinery
    (name, text, value, column, drawProps, fill, size)
  {
    EnergyMaps.InfrastructureSet.call(this, name, text, value, column, drawProps);
    this.fill = fill;
    this.size = size;
    this.stroke = 'rgba(255, 255, 255, 1)';
    this.strokeWidth = SCALE * .75;
    this.zIndex = 0;
    /**
     * Draw oil refinery legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @param {string} color - symbol color, required to pass through but not called
     * @returns {Number} y - updated y axis
     */
    this.drawLegend = function drawRefineryLegend(ctx, x, y, color) {
      y += VERTICAL_INCREMENT;
      _drawOilRefinery(ctx, [x, y], 200000 * this.size); // TODO: Document or extract these magic numbers
      let text = this.text;
      y = EnergyMaps.advanceForType(y, ctx, text, TEXT_OFFSET, x);
      return y;
    };
  }
  Refinery.prototype = new EnergyMaps.InfrastructureSet;

  // TODO: Implement storage, and then add this method as a class member
  /**
     * Draw gas storage legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @param {Object} obj - Infrastructure object
     * @param {string} color - symbol color, bound to `viz` object
   * (some still loosely implemented)
     * @returns {Number} y - updated y axis
     */
  const drawStorageLegend = function drawStorageLegend
    (ctx, x, y, obj, color)
  { // TODO: Reimplement storage.
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    _drawGasStorage(ctx, [x, y]);
    let text = obj.text;
    y = EnergyMaps.advanceForType(y, ctx, text, TEXT_OFFSET, x);
    return y;
  };

  // TODO: Add jsdoc
  const oilAndGas = {
    wells: {
      cross: 5 * SCALE,
      diameter: SCALE * 2,
      stroke: SCALE
    },
    processing: {
      stroke: {
        light: 'rgba(255, 255, 255, 1)',
        width: SCALE * .75
      }
    },
  };

  const oilProduct = {
    stroke: '#3CB371',
    width: 2 * SCALE,
    dash: 2.5 * SCALE
  };

  /**
   * @description Get a set of xy coordinates on the map projection
   * for each element in the dataset.
   * @param {array} queuedData - the supplied dataset
   * @returns {Number[]} xy - Set of xy coordinates
   */
  const _getXY = function _getXY
    (queuedData)
  {
    // generalize it so it doesn't just apply to wells, and also strike
    // the queued data assignment bc some require two data sets
    let data = queuedData[0];

    data.forEach(function(d) {
      return EnergyMaps.projection([+d.lon, +d.lat]);
    });
  }

  /**
   * Draw gas pipelines to the infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas gas-pipeline"
   * @param {Array} queuedData - readfile: '/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson'
   */
  const _drawGasPipes = function _drawGasPipes
    (ctx, queuedData)
  {

    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let pipeData = queuedData;

    ctx.lineCap = 'round';
    ctx.strokeStyle = EnergyMaps.gasPipeline.stroke;
    ctx.lineWidth = EnergyMaps.gasPipeline.width / EnergyMaps.transform.k;
    ctx.beginPath();
    EnergyMaps.path(pipeData);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const _drawOilProdPipes = function _drawOilProdPipes
    (ctx, queuedData)
  {
    // TODO: Make this reference the Transport objeect oilProductPipeline
    //  instantiated towards the end of this file, much in the same way
    //  that draw_oil_pipes() references the Transport object oilPipeline
    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);
    let oilProdPipeData = queuedData;
    let OIL_PRODUCT_LINE_DASH = [ oilProduct.dash / EnergyMaps.transform.k,
      (oilProduct.dash + 2 * oilProduct.width) / EnergyMaps.transform.k ];
    ctx.lineWidth = oilProduct.width / EnergyMaps.transform.k;
    ctx.strokeStyle = oilProduct.stroke;
    ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
    ctx.beginPath();
    EnergyMaps.path(oilProdPipeData);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // TODO: Is there a railroad or other line drawing function that we can
  //  abstract multiple line drawing functions out to?
  const _drawOilPipes = function _drawOilPipes
    (ctx, queuedData)
  {
    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let oilPipeData = queuedData;
    ctx.strokeStyle = EnergyMaps.oilPipeline.stroke;
    ctx.lineWidth = EnergyMaps.oilPipeline.width / EnergyMaps.transform.k;
    ctx.beginPath();
    EnergyMaps.path(oilPipeData);
    ctx.stroke();
  };

  // TODO: Consider passing an obj so you can call its stroke, diameter,
  //  and color props
  const _drawWell = function _drawWell
    (ctx, xy, color)
  {
    ctx.strokeStyle = color;
    ctx.lineWidth = oilAndGas.wells.stroke / EnergyMaps.transform.k ** .5;
    ctx.fillStyle = color;
    ctx.beginPath();
    EnergyMaps.drawCircle(ctx, xy,
      oilAndGas.wells.diameter / EnergyMaps.transform.k ** .5);
    ctx.fill();
    ctx.stroke();
  };

  const _drawOffshoreWell = function _drawOffshoreWell
    (ctx, xy, color)
  {
    ctx.strokeStyle = color;
    ctx.lineWidth = oilAndGas.wells.stroke / EnergyMaps.transform.k ** .5;
    ctx.beginPath();
    EnergyMaps.drawX(ctx, xy, oilAndGas.wells.cross / EnergyMaps.transform.k ** .5);
    ctx.stroke();
  };

  const _drawAllWells = function _drawAllWells
    (ctx, queuedData)
  {
    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let wells = queuedData.features;

    // TODO: This filtering is done in the Mongo aggregation pipeline. Remove me.
    // wells = wells
    //   .filter(function(d) { return +d.properties.original.zoom <= +EnergyMaps.transform.k; });
    wells.forEach(function(d, i) {
      let xy = EnergyMaps.projection(d.geometry.coordinates.map(x => +x));
      if (xy === null) {
        return;
      } else {
        if (d.properties.original.oilgas === 'GAS') {
          if (d.properties.original.class === 'Off') {
            _drawOffshoreWell(ctx, xy, EnergyMaps.gasWell.color);
          } else {
            _drawWell(ctx, xy, EnergyMaps.gasWell.color);
          }
        } else {
          if (d.properties.original.class === 'Off') {
            _drawOffshoreWell(ctx, xy, EnergyMaps.oilWell.color);
          } else {
            _drawWell(ctx, xy, EnergyMaps.oilWell.color);
          }
        }
      }
    });
  };

  // TODO: Split up the JSON files based on whatever property marks
  //  processing vs. storage
  const _drawProcessing = function _drawProcessing
    (ctx, queuedData)
  {

    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let gasProcessing = queuedData.features;

    gasProcessing.forEach(function(d, i) {
      let xy = EnergyMaps.projection(d.geometry.coordinates);
      if (xy !== null) {
        _drawGasProcessor(ctx, xy, EnergyMaps.gasProcessing.size);
      }
    });

  };

  const _drawRefining = function _drawRefining
    (ctx, queuedData)
  {
    EnergyMaps.path.context(ctx);
    EnergyMaps.clipRegion(ctx);

    let oilRefineries = queuedData.features;

    if (DATA_YEAR === 2022) {

      oilRefineries.forEach(function(d, i) {
        let r = 0;

        if (d.properties.original.hasOwnProperty('QUANTITY')) {
          // TODO: get scaling value
          r += +d.properties.original.QUANTITY / 250; //  TODO: change the divisor here to get the scale
        }

        d.r = r;
      });

    } else if (DATA_YEAR === 2012) {

      oilRefineries.forEach(function(d, i) {
        let procs = ['Atm_Dist', 'Vac_Dist', 'Cat_Crack', 'Visbreak',
          'Cat_Reform', 'Desulfur', 'Coking', 'Hydro_Crac', 'Alky_Iso'];
        let r = 0;
        for (let i = 0, l = procs.length; i < l; ++i) {
          if (d.properties.original.hasOwnProperty(procs[i])) {
            r += +d.properties.original[procs[i]];
          }
        }
        d.r = r;
      });
    }

    oilRefineries.sort(function(a, b) {
      return d3.descending(a.r, b.r);
    });

    oilRefineries.forEach(function(d) {
      let xy = EnergyMaps.projection(d.geometry.coordinates);
      // for (coord in xy) {
        if (xy != null) {
          _drawOilRefinery(ctx, xy, d.r / EnergyMaps.transform.k ** .5);
          ctx.strokeStyle = oilAndGas.processing.stroke.light;
          ctx.lineWidth = oilAndGas.processing.stroke.width / EnergyMaps.transform.k;
          ctx.beginPath();
          // draw the outline
          let radius = EnergyMaps.oilRefinery.size * d.r / EnergyMaps.transform.k ** .5;
          EnergyMaps.drawPolygon(6, ctx, radius, xy)
          ctx.stroke();
        }
        else {
          console.log(xy);
        }
    });
  };

  const _drawGasProcessor = function _draw_gas_processor
    (ctx, xy, side)
  {
    ctx.beginPath();
    ctx.fillStyle = gasProcessing.fill;
    EnergyMaps.drawTriangle(ctx, xy, side);
    ctx.fill();
  };

  const _drawGasStorage = function _drawGasStorage
    (ctx, xy)
  {
    ctx.beginPath();
    ctx.fillStyle = oilAndGas.processing.gasStorage.fill;
    EnergyMaps.drawBox(ctx, xy, oilAndGas.processing.gasStorage.size);
    ctx.fill();
  };

  /**
   * Draw oil refinery to the infrastructure map as a hexagon
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * "map.layer.oil-refinery"
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} r
   */
  const _drawOilRefinery = function _drawOilRefinery
    (ctx, xy, r)
  {
    const NUM_SIDES_REFIN = 6;
    r *= EnergyMaps.oilRefinery.size;
    ctx.fillStyle = EnergyMaps.oilRefinery.fill;
    ctx.beginPath();
    EnergyMaps.drawPolygon(NUM_SIDES_REFIN, ctx, r, xy);
    ctx.fill();
  };

  const gasWell = new Well('gas-wells', 'Gas wells',
    {2012: 1_059_000_000_000, 2022: 1_059_000_000_000}, 'oil-and-gas', [{
      drawLayer: _drawAllWells,
      primary: 'wells',
      secondary: 'gas',
      d3Fetch: d3.json
    }], 'rgba(0, 191, 255, .8)', 'rgba(0, 191, 255)');

  const oilWell = new Well('oil-wells', 'Oil wells',
    {2012: 654_000_000_000, 2022: 654_000_000_000}, 'oil-and-gas', [{
      drawLayer: _drawAllWells,
      primary: 'wells',
      secondary: 'oil',
      d3Fetch: d3.json
    }], 'rgba(34, 139, 34, .8)', 'rgba(34, 139, 34)');

  const foreignOilWells = {
    name: 'foreign-oil-wells',
    assetValue: {2012: 931_000_000_000, 2022: null},
    drawProps: false,
    column: 'oil-and-gas',
  };

  const foreignGasWells = {
    name: 'foreign-gas-wells',
    assetValue: {2012: 63_000_000_000, 2022: null},
    drawProps: false,
    column: 'oil-and-gas',
  };

  const gasPipeline = new Transport('gas-pipelines', 'Gas pipelines',
    {2012: 940_000_000_000, 2022: 940_000_000_000}, 'oil-and-gas', [{
      drawLayer: _drawGasPipes,
      primary: 'pipelines',
      secondary: 'gas',
      d3Fetch: d3.json
    }], 'rgba(0, 191, 255, .5)', 1.8 * SCALE);

  let oilProductPipeline = new Transport('oil-product-pipelines', 'Oil product pipelines',
    {2012: null, 2022: null}, 'oil-and-gas', [{
      drawLayer: _drawOilProdPipes,
      primary: 'pipelines',
      secondary: 'petroleum_product',
      d3Fetch: d3.json
    }], '#3CB371', 2 * SCALE);

  oilProductPipeline.dash = 2.5 * SCALE;
  oilProductPipeline.drawLegend = function drawPipelineLegend(ctx, x, y, dashed) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    let OIL_PRODUCT_LINE_DASH = [ oilProduct.dash / EnergyMaps.transform.k,
      (oilProduct.dash + 2 * oilProduct.width) / EnergyMaps.transform.k ];
    ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
    let text = this.text;
    //FIXME: The `dash` argument to `draw_line()` is overloaded and shouldn't be.
    // it takes either `false` or an iterable that describes a dash.
    y = EnergyMaps.drawLine(ctx, x, y, this, OIL_PRODUCT_LINE_DASH, text)
    ctx.setLineDash([]);
    return y;
  };

  const oilPipeline = new Transport('oil-pipelines', 'Oil pipelines',
    {2012: 170_000_000_000, 2022: 170_000_000_000}, 'oil-and-gas', [{
      drawLayer: _drawOilPipes,
      primary: 'pipelines',
      secondary: 'oil',
      d3Fetch: d3.json,
      next_layer: EnergyMaps.oilProductPipeline
    }], '#3CB371', 1.5 * SCALE);

  const oilRefinery = new Refinery('oil-refineries', 'Oil refineries',
    {2012: 373_000_000_000, 2022: null}, 'oil-and-gas', [{
      drawLayer: _drawRefining,
      primary: 'refineries',
      secondary: 'petroleum',
      d3Fetch: d3.json
    }], 'rgba(60, 179, 113, .7)', .006 * SCALE);

  const gasProcessing = new Processing('gas-processing', 'Gas processing',
    {2012: 45_000_000_000, 2022: null}, 'oil-and-gas', [{
      drawLayer: _drawProcessing,
      primary: 'processing_plants',
      secondary: 'gas',
      d3Fetch: d3.json
    }], 'rgba(0, 0, 139, .5)', 1.5 * SCALE);

  const oilAndGasStorage = {
    name: 'oil-and-gas-storage',
    assetValue: {2012: 181_000_000_000, 2022: null},
    drawProps: false,
    column: 'oil-and-gas',
  };

  EnergyMaps.gasWell = gasWell;
  EnergyMaps.oilWell = oilWell;
  EnergyMaps.foreignOilWells = foreignOilWells;
  EnergyMaps.foreignGasWells = foreignGasWells;
  EnergyMaps.gasPipeline = gasPipeline;
  EnergyMaps.oilProductPipeline = oilProductPipeline;
  EnergyMaps.oilPipeline = oilPipeline;
  EnergyMaps.oilRefinery = oilRefinery;
  EnergyMaps.gasProcessing = gasProcessing;
  EnergyMaps.oilAndGasStorage = oilAndGasStorage;

  return EnergyMaps;

})(EnergyMaps || {});