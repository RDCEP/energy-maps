/**
 * @file Provides global draw functions and any helpers for gas & oil wells,
 * pipelines, refineries, processing, and storage.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Wells
 */

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
function Well(name, text, value, column, draw_props, color, legend_color) {
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

    y = advance_vertical_increment(y, ctx, this.color, this.stroke); 
    draw_circle(ctx, [x, y], this.diameter * 4);
    ctx.stroke();
    ctx.fill();
    ctx.lineWidth = oil_and_gas.wells.stroke * 2
    y = advance_for_type(y, ctx, this.text, text_offset, x);
    y = advance_vertical_increment(y, ctx, this.color, oil_and_gas.wells.stroke);
    draw_x(ctx, [x, y], oil_and_gas.wells.cross * 1.5);
    ctx.stroke();
    
    let text = `${this.text.slice(0, 3)} offshore wells`
    y = advance_for_type(y, ctx, text, text_offset, x);
    
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
function Transport(name, text, value, column, draw_props, stroke, width) {
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
    y = draw_line(ctx, x, y, this, dashed, text)
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
function Processing(name, text, value, column, draw_props, fill, size) {
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
    draw_gas_processor(ctx, [x, y], 5);
    let text = this.text;
    y = advance_for_type(y, ctx, text, text_offset, x);
    return y;
  };
}
Processing.prototype = new InfrastructureSet;

function Refinery(name, text, value, column, draw_props, fill, size) {
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
    draw_oil_refinery(ctx, [x, y], 200000 * this.size); // TODO: Document or extract these magic numbers
    let text = this.text;
    y = advance_for_type(y, ctx, text, text_offset, x);
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
  const draw_storage_legend = function draw_storage_legend(ctx, x, y, obj, color) { // TODO: Reimplement storage. 
    // Advance vertical increment
    y += VERTICAL_INCREMENT;
    draw_gas_storage(ctx, [x, y]);
    let text = obj.text;
    y = advance_for_type(y, ctx, text, text_offset, x);
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
const get_xy = function get_xy(queued_data) {
  // generalize it so it doesn't just apply to wells, and also strike
  // the queued data assignment bc some require two data sets
  let data = queued_data[0];
  
  data.forEach(function(d) { 
    return projection([+d.lon, +d.lat]);
  });
}

/**
 * Draw gas pipelines to the infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas gas-pipeline"
 * @param {Array} queued_data - readfile: '/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson'
 */
const draw_gas_pipes = function draw_gas_pipes(ctx, queued_data) {
  
  path.context(ctx);
  clip_region(ctx)

  let pipe_data = queued_data[0];
  // const path = get_path(ctx);

  ctx.lineCap = 'round';
  ctx.strokeStyle = gas_pipeline.stroke;
  ctx.lineWidth = gas_pipeline.width / transform.k;
  ctx.beginPath();
  path(pipe_data);
  ctx.stroke();
  ctx.setLineDash([]);
  finish_loading_layer();
  //;
};

const draw_oil_prod_pipes = function draw_oil_prod_pipes(ctx, queued_data) {
  // TODO: Make this reference the Transport objeect oil_product_pipeline instantiated towards the end of this file, much in the same way that draw_oil_pipes() references the Transport object oil_pipeline
  path.context(ctx);
  clip_region(ctx);
  let oil_prod_pipe_data = queued_data[0];
  let OIL_PRODUCT_LINE_DASH = [ oil_product.dash / transform.k,
    (oil_product.dash + 2 * oil_product.width) / transform.k ];
  ctx.lineWidth = oil_product.width / transform.k;
  ctx.strokeStyle = oil_product.stroke;
  ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
  ctx.beginPath();
  path(oil_prod_pipe_data);
  ctx.stroke();
  ctx.setLineDash([]);
  finish_loading_layer();
}

// TODO: Is there a railroad or other line drawing function that we can
//  abstract multiple line drawing functions out to?
const draw_oil_pipes = function draw_pipes(ctx, queued_data) {
  path.context(ctx);
  clip_region(ctx);

  let oil_pipe_data = queued_data[0];
  ctx.strokeStyle = oil_pipeline.stroke;
  ctx.lineWidth = oil_pipeline.width / transform.k;
  ctx.beginPath();
  path(oil_pipe_data);
  ctx.stroke();
  finish_loading_layer();
  
  // Prod pipes
  ('draw_oil_prod_pipes');
  ctx = oil_product_pipeline.context;
  path.context(ctx);
  region = new Path2D();
  region.rect(0, 0, width, height);
  ctx.clip(region);
  let oil_prod_pipe_data = d3.json(oil_product_pipeline.draw_props.src)[0];
  let OIL_PRODUCT_LINE_DASH = [ oil_product.dash / transform.k,
    (oil_product.dash + 2 * oil_product.width) / transform.k ];
  ctx.lineWidth = oil_product.width / transform.k;
  ctx.strokeStyle = oil_product.stroke;
  ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
  ctx.beginPath();
  path(oil_prod_pipe_data);
  ctx.stroke();
  ctx.setLineDash([]);
  finish_loading_layer();
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
const draw_well = function draw_well(ctx, xy, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = oil_and_gas.wells.stroke / transform.k ** .5;
  ctx.fillStyle = color;
  ctx.beginPath();
  draw_circle(ctx, xy, oil_and_gas.wells.diameter / transform.k ** .5);
  ctx.stroke();
};

const draw_off_well = function draw_off_well(ctx, xy, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = oil_and_gas.wells.stroke / transform.k ** .5;
  ctx.beginPath();
  draw_x(ctx, xy, oil_and_gas.wells.cross / transform.k ** .5);
  ctx.stroke();
};

/**
 * Draw gas wells to the infrastructure map.
 * @param {Array} queued_data - readfile: '/static/csv/wells_gas1.csv'
 * & '/static/csv/wells_gas2.csv'
 */
const draw_gas_wells = function draw_gas_wells(queued_data) {

  get_xy(queued_data);
  draw_well(xy, gas_well.color)

};

/**
 * Draw oil wells to the infrastructure map.
 * @param {Array} queued_data - readfile: '/static/csv/wells_oil1.csv'
 * & '/static/csv/wells_oil2.csv'
 */
const draw_oil_wells = function draw_oil_wells(queued_data) {

  get_xy(queued_data)

  if (d.class === 'Off') {
    draw_off_well(xy);
  } else {
    draw_well(xy, oil_well.color);
  }

};

const draw_all_wells = function draw_all_wells(ctx, queued_data) {
  path.context(ctx);
  clip_region(ctx)

  let wells = queued_data[0];

  wells = wells
    .filter(function(d) { return +d.zoom <= +transform.k; })
  wells.forEach(function(d, i) {
    let xy = projection([+d.lon, +d.lat]);
    if (xy === null) {
      return;
    } else {
      if (d.oilgas === 'GAS') {
        if (d.class === 'Off') {
          draw_off_well(ctx, xy, gas_well.color);
        } else {
          draw_well(ctx, xy, gas_well.color);
        }
      } else {
        if (d.class === 'Off') {
          draw_off_well(ctx, xy, oil_well.color);
        } else {
          draw_well(ctx, xy, oil_well.color);
        }
      }
    }
    if (i === wells.length - 1) {
      finish_loading_layer();
    }
  });
};

// TODO: Split up the JSON files based on whatever property marks
//  processing vs. storage
const draw_processing = function draw_processing(ctx, queued_data) {

  path.context(ctx);
  clip_region(ctx)

  let gproc = queued_data[0]; // gas processing
  // let gstor = queued_data[1]; // gas storage

  gproc.forEach(function(d, i) {
    let xy = projection([+d.lon, +d.lat]);
    draw_gas_processor(ctx, xy, gas_processing.size);
    if (i === gproc.length - 1) { 
      finish_loading_layer();
    }
  });

  //;

  // gstor.forEach(function(d) {
  //   let xy = projection([+d.lon, +d.lat]);
  //   draw_gas_storage(ctx, xy);
  // });

};

// TODO: Split up the JSON files based on whatever property marks
//  processing vs. storage
const draw_storage = function draw_storage(ctx, queued_data) {
  let gstor = queued_data[0]; // gas storage
  gstor.forEach(function(d, i) {
    let xy = projection([+d.lon, +d.lat]);
    draw_gas_storage(ctx, xy);
    if (i === gstor.length - 1) { 
      hide_spinner(); 
    }
    return xy
  });
}

const draw_refining = function draw_refining(ctx, queued_data) {

  path.context(ctx);
  clip_region(ctx)

  let oref = queued_data[0].features; // TODO: does oref mean oil refineries?

  // TODO: Okay, what the fuck are we doing here?
  oref.forEach(function(d, i) {
    let procs = ['Atm_Dist', 'Vac_Dist', 'Cat_Crack', 'Visbreak',
      'Cat_Reform', 'Desulfur', 'Coking', 'Hydro_Crac', 'Alky_Iso'];
    let r = 0;
    for (let i = 0; i < procs.length; ++i) {
      if (d.properties.hasOwnProperty(procs[i])) {
        r += +d.properties[procs[i]];
      }
    }
    d.r = r;
    if (i === oref.length - 1) { 
      finish_loading_layer();
    }
  });

  oref.sort(function(a, b) {
    return d3.descending(a.r, b.r);
  });

  oref.forEach(function(d) {
    let xy = projection(d.geometry.coordinates);
    draw_oil_refinery(ctx, xy, d.r / transform.k ** .5);
    ctx.strokeStyle = oil_and_gas.processing.stroke.light;
    ctx.lineWidth = oil_and_gas.processing.stroke.width / transform.k;
    ctx.beginPath();
    // draw the outline
    draw_polygon(6, ctx, oil_refinery.size * d.r / transform.k ** .5, xy)
    ctx.stroke();
  });
  //;
};

const draw_gas_processor = function draw_gas_processor(ctx, xy, side) {
  ctx.beginPath();
  ctx.fillStyle = gas_processing.fill;
  draw_triangle(ctx, xy, side);
  ctx.fill();
};

const draw_gas_storage = function draw_gas_storage(ctx, xy) {
  ctx.beginPath();
  ctx.fillStyle = oil_and_gas.processing.gas_storage.fill;
  draw_box(ctx, xy, oil_and_gas.processing.gas_storage.size);
  ctx.fill();
};

/**
 * Draw oil refinery to the infrastructure map as a hexagon
 * @param {Object} ctx - HTML5 canvas context: bound to canvas
 * "map.layer.oil-refinery"
 * @param {Array} xy - Array of xy coordinates 
 * @param {Number} r 
 */
const draw_oil_refinery = function draw_oil_refinery(ctx, xy, r) {
  const NUM_SIDES_REFIN = 6
  r *= oil_refinery.size;
  ctx.fillStyle = oil_refinery.fill;
  ctx.beginPath();
  draw_polygon(NUM_SIDES_REFIN, ctx, r, xy)
  ctx.fill();
};

let gas_well = new Well('gas-wells', 'Gas wells', 1_059_000_000_000, 'oil-and-gas', [{
  draw_layer: draw_all_wells,
  src: [ `/static/csv/wells_gas.csv` ],
  d3_fetch: d3.csv
}], 'rgba(0, 191, 255, .5)', 'rgba(0, 191, 255)')

let oil_well = new Well('oil-wells', 'Oil wells', 654_000_000_000, 'oil-and-gas', [{
  draw_layer: draw_all_wells,
  src: [ `/static/csv/wells_oil.csv` ],
  d3_fetch: d3.csv
}], 'rgba(34, 139, 34, .5)', 'rgba(34, 139, 34)')

let foreign_oil_wells = {
  name: 'foreign-oil-wells',
  value: 931_000_000_000,
  draw_props: false,
  column: 'oil-and-gas',
}

let foreign_gas_wells = {
  name: 'foreign-gas-wells',
  value: 63_000_000_000,
  draw_props: false,
  column: 'oil-and-gas',
}

let gas_pipeline = new Transport('gas-pipelines', 'Gas pipelines', 940_000_000_000, 'oil-and-gas', [{
  draw_layer: draw_gas_pipes,
  src: ['/static/json/NaturalGas_InterIntrastate_Pipelines_US.geojson'],
  d3_fetch: d3.json
}], 'rgba(0, 191, 255, .5)', 1.8 * SCALE);

let oil_product_pipeline = new Transport('oil-product-pipelines', 'Oil product pipelines', null, 'oil-and-gas', [{
  draw_layer: draw_oil_prod_pipes,
  src: [`/static/json/PetroleumProduct_Pipelines_US_Nov2014_clipped.geojson`],
  d3_fetch: d3.json
}], '#3CB371', 2 * SCALE);
oil_product_pipeline.dash = 2.5 * SCALE;
oil_product_pipeline.draw_legend = function draw_pipeline_legend(ctx, x, y, dashed) {
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.width;
  let OIL_PRODUCT_LINE_DASH = [ oil_product.dash / transform.k,
    (oil_product.dash + 2 * oil_product.width) / transform.k ];
  ctx.setLineDash(OIL_PRODUCT_LINE_DASH);
  let text = this.text;
  //FIXME: The `dash` argument to `draw_line()` is overloaded and shouldn't be.
  // it takes either `false` or an iterable that describes a dash.
  y = draw_line(ctx, x, y, this, OIL_PRODUCT_LINE_DASH, text)
  ctx.setLineDash([]);
  return y;
};

let oil_pipeline = new Transport('oil-pipelines', 'Oil pipelines', 170_000_000_000, 'oil-and-gas', [{
  draw_layer: draw_oil_pipes,
  src: [`/static/json/CrudeOil_Pipelines_US_Nov2014_clipped.geojson`],
  d3_fetch: d3.json,
  next_layer: oil_product_pipeline
}], '#3CB371', 1.5 * SCALE);

let oil_refinery = new Refinery('oil-refineries', 'Oil refineries', 373_000_000_000, 'oil-and-gas', [{
  draw_layer: draw_refining,
  src: [`/static/json/Petroleum_Refineries_US_2015.geojson`],
  d3_fetch: d3.json
}], 'rgba(60, 179, 113, .7)', .006 * SCALE);

let gas_processing = new Processing('gas-processing', 'Gas processing', 45_000_000_000, 'oil-and-gas', [{
  draw_layer: draw_processing,
  src: [ `/static/csv/nproc.csv`],
  d3_fetch: d3.csv
}], 'rgba(0, 0, 139, .5)', 1.5 * SCALE);

let oil_and_gas_storage = { name: 'oil-and-gas-storage',
  value: 181_000_000_000,
  draw_props: false,
// TODO: Split up the JSON files based on whatever property marks processing vs. storage
// drad3_fetch: {
//   draw_layer: draw_storage,
//   src: [ `/static/csv/nproc.csv`],
//   d3_fetch: d3.csv
// },
  column: 'oil-and-gas',
}
