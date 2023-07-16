/**
 * @file Provides global draw functions and any helpers for gas & oil wells,
 * pipelines, refineries, processing, and storage.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Wells
 */

EnergyMaps = (function (energy_maps, InfrastructureSet) {

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
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @param {String} color - rgba value
   * @param {String} legend_color - rgba value
   * @property {Number} width - scaled value for symbols on the map
   * @property {Number} cross - scaled value for cross symbols on the map
   * @property {Number} diameter - scaled value for circular symbols on the map
   * @property {Number} stroke - stroke width
   */
  let Well = function Well
    (name, text, value, column, draw_props,
     color, legend_color)
  {
    InfrastructureSet.call(this, name, text, value, column, draw_props);
    this.color = color;
    this.legend_color = legend_color;
    this.width = SCALE / 6;
    this.cross = 5 * SCALE;
    this.diameter = SCALE / 2;
    this.stroke = SCALE;
    this.z_index = 0;
    /**
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @returns {Number} y - updated y axis
     */
    this.draw_legend = function draw_well_legend(ctx, x, y) {

      y = energy_maps.advance_vertical_increment(y, ctx, this.color, this.stroke);
      energy_maps.draw_circle(ctx, [x, y], this.diameter * 4);
      ctx.stroke();
      ctx.fill();
      ctx.lineWidth = oil_and_gas.wells.stroke * 2;
      y = energy_maps.advance_for_type(y, ctx, this.text, TEXT_OFFSET, x);
      y = energy_maps.advance_vertical_increment(y, ctx, this.color, oil_and_gas.wells.stroke);
      energy_maps.draw_x(ctx, [x, y], oil_and_gas.wells.cross * 1.5);
      ctx.stroke();

      let text = `${this.text.slice(0, 3)} offshore wells`;
      y = energy_maps.advance_for_type(y, ctx, text, TEXT_OFFSET, x);

      return y;
    };
  }
  Well.prototype = new InfrastructureSet;

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
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @param {String} stroke - rgba value
   * @param {Number} width - scaled value for symbols on the map
   */
  let Transport = function Transport
    (name, text, value, column, draw_props,
     stroke, width)
  {
    InfrastructureSet.call(this, name, text, value, column, draw_props);
    this.stroke = stroke;
    this.width = width;
    this.z_index = 0;
    /**
     * Draw pipeline legend to its HTML5 canvas context. All params passed
     * to draw_line() as a helper.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @param {boolean} dashed - true if line should be dashed, false if solid
     * @returns {Number} y - updated y axis
     */
    this.draw_legend = function draw_pipeline_legend(ctx, x, y, dashed) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      let text = this.text;
      y = energy_maps.draw_line(ctx, x, y, this, dashed, text);
      return y;
    };
  }
  Transport.prototype = new InfrastructureSet;

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
   * @param {Array} draw_props - properties used to parse the data and render
   * the visualization
   * @param {String} fill - rgba value
   * @param {Number} size - scaled value for symbols on the map
   * @property {String} stroke - stroke color
   * @property {Number} strokeWidth - stroke width
   */
  let Processing = function Processing
    (name, text, value, column, draw_props,
     fill, size)
  {
    InfrastructureSet.call(this, name, text, value, column, draw_props);
    this.fill = fill;
    this.size = size;
    this.stroke = 'rgba(255, 255, 255, 1)';
    this.strokeWidth = SCALE * .75;
    this.z_index = 0;
    /**
     * Draw gas processing legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @returns {Number} y - updated y axis
     */
    this.draw_legend = function draw_processing_legend(ctx, x, y) {
      // Advance vertical increment
      y += VERTICAL_INCREMENT;
      _draw_gas_processor(ctx, [x, y], 5);
      let text = this.text;
      y = energy_maps.advance_for_type(y, ctx, text, TEXT_OFFSET, x);
      return y;
    };
  }
  Processing.prototype = new InfrastructureSet;

  let Refinery = function Refinery
    (name, text, value, column, draw_props, fill, size)
  {
    InfrastructureSet.call(this, name, text, value, column, draw_props);
    this.fill = fill;
    this.size = size;
    this.stroke = 'rgba(255, 255, 255, 1)';
    this.strokeWidth = SCALE * .75;
    this.z_index = 0;
    /**
     * Draw oil refinery legend to its HTML5 canvas context.
     * @param {Object} ctx - HTML5 canvas context
     * @param {Number} x - x axis
     * @param {Number} y - y axis
     * @param {string} color - symbol color, required to pass through but not called
     * @returns {Number} y - updated y axis
     */
    this.draw_legend = function draw_refinery_legend(ctx, x, y, color) {
      y += VERTICAL_INCREMENT;
      _draw_oil_refinery(ctx, [x, y], 200000 * this.size); // TODO: Document or extract these magic numbers
      let text = this.text;
      y = energy_maps.advance_for_type(y, ctx, text, TEXT_OFFSET, x);
      return y;
    };
  }
  Refinery.prototype = new InfrastructureSet;

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
  const draw_storage_legend = function draw_storage_legend
    (ctx, x, y, obj, color)
  { // TODO: Reimplement storage.
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    _draw_gas_storage(ctx, [x, y]);
    let text = obj.text;
    y = energy_maps.advance_for_type(y, ctx, text, TEXT_OFFSET, x);
    return y;
  };

  // TODO: Add jsdoc
  const oil_and_gas = {
    wells: {
  //     width: SCALE / 6,
      cross: 5 * SCALE,
      diameter: SCALE / 2,
      stroke: SCALE
    },
    processing: {
  // Gas storage is left here because we may want this info to implement it later
  //     gas_storage: {
  //       fill: 'rgb(45, 45, 45, .9)',
  //       size: 5 * SCALE
  //     },
      stroke: {
        light: 'rgba(255, 255, 255, 1)',
        width: SCALE * .75
      }
    },
  };

  const oil_product = {
    stroke: '#3CB371',
    width: 2 * SCALE,
    dash: 2.5 * SCALE
  };

  /**
   * @description Get a set of xy coordinates on the map projection
   * for each element in the dataset.
   * @param {array} queued_data - the supplied dataset
   * @returns {Number[]} xy - Set of xy coordinates
   */
  const _get_xy = function _get_xy
    (queued_data)
  {
    // generalize it so it doesn't just apply to wells, and also strike
    // the queued data assignment bc some require two data sets
    let data = queued_data[0];

    data.forEach(function(d) {
      return energy_maps.projection([+d.lon, +d.lat]);
    });
  }

  /**
   * Draw gas pipelines to the infrastructure map.
   * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas gas-pipeline"
   * @param {Array} queued_data - readfile: '/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson'
   */
  const _draw_gas_pipes = function _draw_gas_pipes
    (ctx, queued_data)
  {

    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let pipe_data = queued_data[0];
    // const path = get_path(ctx);

    ctx.lineCap = 'round';
    ctx.strokeStyle = energy_maps.gas_pipeline.stroke;
    ctx.lineWidth = energy_maps.gas_pipeline.width / TRANSFORM.k;
    ctx.beginPath();
    energy_maps.path(pipe_data);
    ctx.stroke();
    ctx.setLineDash([]);
    energy_maps.finish_loading_layer();
  };

  const _draw_oil_prod_pipes = function _draw_oil_prod_pipes
    (ctx, queued_data)
  {
    // TODO: Make this reference the Transport objeect oil_product_pipeline instantiated towards the end of this file, much in the same way that draw_oil_pipes() references the Transport object oil_pipeline
    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);
    let oil_prod_pipe_data = queued_data[0];
    let OIL_PRODUCT_LINE_DASH = [ oil_product.dash / TRANSFORM.k,
      (oil_product.dash + 2 * oil_product.width) / TRANSFORM.k ];
    ctx.lineWidth = oil_product.width / TRANSFORM.k;
    ctx.strokeStyle = oil_product.stroke;
    ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
    ctx.beginPath();
    energy_maps.path(oil_prod_pipe_data);
    ctx.stroke();
    ctx.setLineDash([]);
    energy_maps.finish_loading_layer();
  }

  // TODO: Is there a railroad or other line drawing function that we can
  //  abstract multiple line drawing functions out to?
  const _draw_oil_pipes = function _draw_pipes
    (ctx, queued_data)
  {
    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let oil_pipe_data = queued_data[0];
    ctx.strokeStyle = energy_maps.oil_pipeline.stroke;
    ctx.lineWidth = energy_maps.oil_pipeline.width / TRANSFORM.k;
    ctx.beginPath();
    energy_maps.path(oil_pipe_data);
    ctx.stroke();
    energy_maps.finish_loading_layer();

    // Commented out because it wasn't actually firing
    // Prod pipes
    // ('draw_oil_prod_pipes');
    // ctx = oil_product_pipeline.context;
    // path.context(ctx);
    // region = new Path2D();
    // region.rect(0, 0, width, height);
    // ctx.clip(region);
    // let oil_prod_pipe_data = d3.json(oil_product_pipeline.draw_props.src)[0];
    // let OIL_PRODUCT_LINE_DASH = [ oil_product.dash / transform.k,
    //   (oil_product.dash + 2 * oil_product.width) / transform.k ];
    // ctx.lineWidth = oil_product.width / transform.k;
    // ctx.strokeStyle = oil_product.stroke;
    // ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
    // ctx.beginPath();
    // path(oil_prod_pipe_data);
    // ctx.stroke();
    // ctx.setLineDash([]);
    // finish_loading_layer();
  };

  // TODO: Simplify well drawing functions by adding relevant properties to nested objects
  // Perhaps t his can include draw functions like draw_circle or draw_x to yield a single draw_well fcn
  /**
   * const draw_well = function draw_well(ctx, xy, color, function)
   *  */

  // const draw_well2 = function draw_well2(ctx, xy, obj, fill) { // use obj for color and function
  //   ctx.strokeStyle = obj.color;
  //   ctx.strokeWidth = oil_and_gas.wells.stroke;;
  //   if (fill) {
  //     ctx.fillStyle = color;
  //   }
  //   ctx.beginPath();
  //   obj.f;
  //   ctx.stroke();
  // }

  // TODO: Consider passing an obj so you can call its stroke, diameter,
  //  and color props
  const _draw_well = function _draw_well
    (ctx, xy, color)
  {
    ctx.strokeStyle = color;
    ctx.lineWidth = oil_and_gas.wells.stroke / TRANSFORM.k ** .5;
    ctx.fillStyle = color;
    ctx.beginPath();
    energy_maps.draw_circle(ctx, xy, oil_and_gas.wells.diameter / TRANSFORM.k ** .5);
    ctx.stroke();
  };

  const _draw_off_well = function _draw_off_well
    (ctx, xy, color)
  {
    ctx.strokeStyle = color;
    ctx.lineWidth = oil_and_gas.wells.stroke / TRANSFORM.k ** .5;
    ctx.beginPath();
    energy_maps.draw_x(ctx, xy, oil_and_gas.wells.cross / TRANSFORM.k ** .5);
    ctx.stroke();
  };

  /**
   * Draw gas wells to the infrastructure map.
   * @param {Array} queued_data - readfile: '/static/csv/wells_gas1.csv'
   * & '/static/csv/wells_gas2.csv'
   */
  const _draw_gas_wells = function _draw_gas_wells
    (queued_data)
  {

    _get_xy(queued_data);
    _draw_well(xy, energy_maps.gas_well.color);

  };

  /**
   * Draw oil wells to the infrastructure map.
   * @param {Array} queued_data - readfile: '/static/csv/wells_oil1.csv'
   * & '/static/csv/wells_oil2.csv'
   */
  const _draw_oil_wells = function _draw_oil_wells
    (queued_data)
  {

    _get_xy(queued_data)

    if (d.class === 'Off') {
      _draw_off_well(xy);
    } else {
      _draw_well(xy, energy_maps.oil_well.color);
    }

  };

  const _draw_all_wells = function _draw_all_wells
    (ctx, queued_data)
  {
    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let wells = queued_data[0].features;

    wells = wells
      .filter(function(d) { return +d.properties.original.zoom <= +TRANSFORM.k; });
    wells.forEach(function(d, i) {
      let xy = energy_maps.projection([+d.properties.original.lon, +d.properties.original.lat]);
      if (xy === null) {
        return;
      } else {
        if (d.properties.original.oilgas === 'GAS') {
          if (d.properties.original.class === 'Off') {
            _draw_off_well(ctx, xy, energy_maps.gas_well.color);
          } else {
            _draw_well(ctx, xy, energy_maps.gas_well.color);
          }
        } else {
          if (d.properties.original.class === 'Off') {
            _draw_off_well(ctx, xy, energy_maps.oil_well.color);
          } else {
            _draw_well(ctx, xy, energy_maps.oil_well.color);
          }
        }
      }
      if (i === wells.length - 1) {
        energy_maps.finish_loading_layer();
      }
    });
  };

  // TODO: Split up the JSON files based on whatever property marks
  //  processing vs. storage
  const _draw_processing = function _draw_processing
    (ctx, queued_data)
  {

    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let gproc = queued_data[0].features; // gas processing
    // let gstor = queued_data[1]; // gas storage

    gproc.forEach(function(d, i) {
      let xy = energy_maps.projection([+d.geometry.coordinates[0], +d.geometry.coordinates[1]]);

      // Figure out why new data draws above US northern border
      for (coord in xy) {
        if (coord != null) {
          _draw_gas_processor(ctx, xy, energy_maps.gas_processing.size);
        } else {
          console.log(coord);
        }
      }
      if (i === gproc.length - 1) {
        energy_maps.finish_loading_layer();
      }
    });

    // gstor.forEach(function(d) {
    //   let xy = projection([+d.lon, +d.lat]);
    //   draw_gas_storage(ctx, xy);
    // });

  };

  // TODO: Split up the JSON files based on whatever property marks
  //  processing vs. storage
  const _draw_storage = function _draw_storage
    (ctx, queued_data)
  {
    let gstor = queued_data[0]; // gas storage
    gstor.forEach(function(d, i) {
      let xy = energy_maps.projection([+d.lon, +d.lat]);
      _draw_gas_storage(ctx, xy);
      if (i === gstor.length - 1) {
        energy_maps.hide_spinner();
      }
      return xy;
    });
  }

  const _draw_refining = function _draw_refining
    (ctx, queued_data)
  {

    energy_maps.path.context(ctx);
    energy_maps.clip_region(ctx);

    let oref = queued_data[0].features;

    if (DATA_YEAR === 2022) {
      oref.forEach(function(d, i) {
        let r = 0;

        if (d.properties.original.hasOwnProperty('QUANTITY')) {
          // TODO: get scaling value
          r += +d.properties.original.QUANTITY/250; // TODO: change the divisor here to get the scale
        }

        d.r = r;

        if (i === oref.length - 1) {
          energy_maps.finish_loading_layer();
        }
      });
    } else if (DATA_YEAR === 2012) {
      oref.forEach(function(d, i) {
        let procs = ['Atm_Dist', 'Vac_Dist', 'Cat_Crack', 'Visbreak',
          'Cat_Reform', 'Desulfur', 'Coking', 'Hydro_Crac', 'Alky_Iso'];
        let r = 0;
        for (let i = 0, l = procs.length; i < l; ++i) {
          if (d.properties.original.hasOwnProperty(procs[i])) {
            r += +d.properties.original[procs[i]];
          }
        }
        d.r = r;
        if (i === oref.length - 1) {
          energy_maps.finish_loading_layer();
        }
      });
    }

    oref.sort(function(a, b) {
      return d3.descending(a.r, b.r);
    });

    oref.forEach(function(d) {
      let xy = energy_maps.projection(d.geometry.coordinates);
      // for (coord in xy) {
        if (xy != null) {
          _draw_oil_refinery(ctx, xy, d.r / TRANSFORM.k ** .5);
          ctx.strokeStyle = oil_and_gas.processing.stroke.light;
          ctx.lineWidth = oil_and_gas.processing.stroke.width / TRANSFORM.k;
          ctx.beginPath();
          // draw the outline
          energy_maps.draw_polygon(6, ctx, energy_maps.oil_refinery.size * d.r / TRANSFORM.k ** .5, xy)
          ctx.stroke();
        }
        else {
          console.log(xy);
        }
    });
  };

  const _draw_gas_processor = function _draw_gas_processor
    (ctx, xy, side)
  {
    ctx.beginPath();
    ctx.fillStyle = gas_processing.fill;
    energy_maps.draw_triangle(ctx, xy, side);
    ctx.fill();
  };

  const _draw_gas_storage = function _draw_gas_storage
    (ctx, xy)
  {
    ctx.beginPath();
    ctx.fillStyle = oil_and_gas.processing.gas_storage.fill;
    energy_maps.draw_box(ctx, xy, oil_and_gas.processing.gas_storage.size);
    ctx.fill();
  };

  /**
   * Draw oil refinery to the infrastructure map as a hexagon
   * @param {Object} ctx - HTML5 canvas context: bound to canvas
   * "map.layer.oil-refinery"
   * @param {Array} xy - Array of xy coordinates
   * @param {Number} r
   */
  const _draw_oil_refinery = function _draw_oil_refinery
    (ctx, xy, r)
  {
    const NUM_SIDES_REFIN = 6;
    r *= energy_maps.oil_refinery.size;
    ctx.fillStyle = energy_maps.oil_refinery.fill;
    ctx.beginPath();
    energy_maps.draw_polygon(NUM_SIDES_REFIN, ctx, r, xy);
    ctx.fill();
  };

  const gas_well = new Well('gas-wells', 'Gas wells', {2012: 1_059_000_000_000, 2022: 1_059_000_000_000}, 'oil-and-gas', [{
    draw_layer: _draw_all_wells,
    // src: [ `/static/csv/wells_gas.csv` ],
    // d3_fetch: d3.csv
    src: [ `/wells/gas` ],
    d3_fetch: d3.json
  }], 'rgba(0, 191, 255, .5)', 'rgba(0, 191, 255)');

  const oil_well = new Well('oil-wells', 'Oil wells', {2012: 654_000_000_000, 2022: 654_000_000_000}, 'oil-and-gas', [{
    draw_layer: _draw_all_wells,
    src: [ `/wells/oil` ],
    d3_fetch: d3.json
  }], 'rgba(34, 139, 34, .5)', 'rgba(34, 139, 34)');

  const foreign_oil_wells = {
    name: 'foreign-oil-wells',
    value: {2012: 931_000_000_000, 2022: null},
    draw_props: false,
    column: 'oil-and-gas',
  };

  const foreign_gas_wells = {
    name: 'foreign-gas-wells',
    value: {2012: 63_000_000_000, 2022: null},
    draw_props: false,
    column: 'oil-and-gas',
  };

  const gas_pipeline = new Transport('gas-pipelines', 'Gas pipelines', {2012: 940_000_000_000, 2022: 940_000_000_000}, 'oil-and-gas', [{
    draw_layer: _draw_gas_pipes,
    src: [`/pipelines/gas`],
    d3_fetch: d3.json
  }], 'rgba(0, 191, 255, .5)', 1.8 * SCALE);

  let oil_product_pipeline = new Transport('oil-product-pipelines', 'Oil product pipelines', {2012: null, 2022: null}, 'oil-and-gas', [{
    draw_layer: _draw_oil_prod_pipes,
    src: [`/pipelines/petroleum_product`],
    // src: [`/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson`],
    d3_fetch: d3.json
  }], '#3CB371', 2 * SCALE);

  oil_product_pipeline.dash = 2.5 * SCALE;
  oil_product_pipeline.draw_legend = function draw_pipeline_legend(ctx, x, y, dashed) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    let OIL_PRODUCT_LINE_DASH = [ oil_product.dash / TRANSFORM.k,
      (oil_product.dash + 2 * oil_product.width) / TRANSFORM.k ];
    ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
    let text = this.text;
    //FIXME: The `dash` argument to `draw_line()` is overloaded and shouldn't be.
    // it takes either `false` or an iterable that describes a dash.
    y = energy_maps.draw_line(ctx, x, y, this, OIL_PRODUCT_LINE_DASH, text)
    ctx.setLineDash([]);
    return y;
  };

  const oil_pipeline = new Transport('oil-pipelines', 'Oil pipelines', {2012: 170_000_000_000, 2022: 170_000_000_000}, 'oil-and-gas', [{
    draw_layer: _draw_oil_pipes,
    src: [`/pipelines/oil`],
    // src: [`/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson`],
    d3_fetch: d3.json,
    next_layer: energy_maps.oil_product_pipeline
  }], '#3CB371', 1.5 * SCALE);

  const oil_refinery = new Refinery('oil-refineries', 'Oil refineries', {2012: 373_000_000_000, 2022: null}, 'oil-and-gas', [{
    draw_layer: _draw_refining,
    src: [`/refineries/petroleum`],
    d3_fetch: d3.json
  }], 'rgba(60, 179, 113, .7)', .006 * SCALE);

  const gas_processing = new Processing('gas-processing', 'Gas processing', {2012: 45_000_000_000, 2022: null}, 'oil-and-gas', [{
    draw_layer: _draw_processing,
    src: [ `/processing_plants/gas`],
    d3_fetch: d3.json
  }], 'rgba(0, 0, 139, .5)', 1.5 * SCALE);

  const oil_and_gas_storage = { name: 'oil-and-gas-storage',
    value: {2012: 181_000_000_000, 2022: null},
    draw_props: false,
  // TODO: Split up the JSON files based on whatever property marks processing vs. storage
  // drad3_fetch: {
  //   draw_layer: draw_storage,
  //   src: [ `/static/csv/nproc.csv`],
  //   d3_fetch: d3.csv
  // },
    column: 'oil-and-gas',
  };

  energy_maps.gas_well = gas_well;
  energy_maps.oil_well = oil_well;
  energy_maps.foreign_oil_wells = foreign_oil_wells;
  energy_maps.foreign_gas_wells = foreign_gas_wells;
  energy_maps.gas_pipeline = gas_pipeline;
  energy_maps.oil_product_pipeline = oil_product_pipeline;
  energy_maps.oil_pipeline = oil_pipeline;
  energy_maps.oil_refinery = oil_refinery;
  energy_maps.gas_processing = gas_processing;
  energy_maps.oil_and_gas_storage = oil_and_gas_storage;

  return energy_maps;

})(EnergyMaps || {}, InfrastructureSet);