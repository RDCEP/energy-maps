/**
 * @file Provides draw functions and any helpers for the electric grid, subdivided into separate classes.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Grid
 */

/** 
 * Instatiates a new Grid object that contains properties used to draw electric grid segments to the map and legend.
 * @class
 * @classdesc Used to create objects that represent electric grid infrastructure.
 * @extends InfrastructureSet
 * @param {String} name - canvas ID
 * @param {String} text - text displayed in the legend
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render the visualization
 * @param {String} heading - class heading in the data file
 * @param {String} color - rgba value
 * @param {Number} line_width - value used to scale the width of the grid
 * @param {Number} nominal_voltage - system voltage
 */
function Grid(name, text, value, column, draw, heading, color, line_width, nominal_voltage) {
    InfrastructureSet.call(this, name, text, value, column, draw);
    this.heading = heading || '';
    this.color = color || 'rgba(0, 0, 0, 0.5)';
    this.line_width = line_width || 0;
    this.nominal_voltage = nominal_voltage || 50;
    this.z_index = 0;
}
Grid.prototype = new InfrastructureSet;

/** 
 * Instatiates a new GridAcCollection object that contains properties used to draw a collection of electric grid segments to the map and legend. 
 * @class
 * @classdesc Used to create objects that represent several units of electric grid infrastructure.
 * @param {String} name - canvas ID
 * @param {Number} value - asset value in USD
 * @param {String} column - class attribute for corresponding column
 * @param {Array} draw - properties used to parse the data and render the visualization
 */
function GridAcCollection(name, value, column, draw, legend_group) {
  this.name = name || '';
  this.value = value || 0;
  this.column = column || '';
  this.z_index = 0;
  this.draw = draw || [];
  this.draw_legend =  legend_group; 
}

/**
 * Get the features you want from your GeoJSON FeatureCollection.
 * @param {Object} infrastructure - readfile
 * @param {Number} c - `grid` object member to compare readfile against
 * @returns {Array} features - an array of features matching the filtered class(es)
 */
const filter_features = function filter_features(infrastructure, c) {
  let features = infrastructure.features.filter(function(d) {
    return d.properties.class === c.heading;
  });
  return features;
}

/**
 * Format electric grid line width for the calling grid class object. 
 * Create an exponential response curve between voltages and line widths
 * to ensure that the lines that represent large voltages aren't too large visually.
 * @param {Number} value - the value to be scaled, bound to the line_width 
 * property of the corresponding `grid` object 
 * @param {Number} divisor - sets line inflection point to adjust the scale of the line width as `value` grows. Must be at least half the size of `value` to get a decent inflection point. Helps determine the mid point of the curve.
 */
const set_line_width = function set_line_width(value, divisor) {
  // TODO: Set nominal voltage as a property of the grid object
  return SCALE * (1 + 3 / (1 + Math.exp(-3 * (value / divisor - 1)))) / transform.k;
}

/**
 * Draw a grid class on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} queued_data - the readfile from '/json/elec_grid_split/'
 * @param {Object} c - grid object
 */
const draw_grid_class = function draw_grid_class(ctx, queued_data, c, key) {
  
  // transform_layer(ctx);
  path.context(ctx);
  let region = new Path2D();
  region.rect(0, 0, width, height);
  ctx.clip(region);

  output_geojson = simplify(key, queued_data)
  
  let tmp_grid = {type: 'FeatureCollection', features: []};
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round'

  features = filter_features(output_geojson, c); // we may not need this anymore, because you can just treat topojson like regular json! as can be seen with lines like queued_data[0].objects.railrdl020 and queued_data[0].objects[key]

  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];

    // TODO: Add descriptive comment here to explain the args
    ctx.lineWidth = set_line_width(features[i]['properties']['voltage'], 500);
    ctx.strokeStyle = c.color;

    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();

      if (i === feat_len - 1) { 
        hide_spinner(); 
      }
    }
  //;
};

  /**
   * Draw AC electric grid legend to its HTML5 canvas context.
   * @param {Object} ctx - HTML5 canvas context
   * @param {Number} x - x axis
   * @param {Number} y - y axis
   * @param {Object} obj - Grid object instance
   * @returns {Number} y - updated y axis
   */
function draw_legend_ac(ctx, x, y, obj) {
  y += VERTICAL_INCREMENT;
  ctx.strokeStyle = obj.color;
  // Draw the square icon as a fat line
  ctx.lineCap ='butt';
  ctx.lineWidth = 14 * SCALE;
  ctx.beginPath();
  ctx.moveTo(x - 7 * SCALE, y);
  ctx.lineTo(x + 7 * SCALE, y);
  ctx.stroke();
  if (obj === ac_na) {
    // FIXME: This is a kludge for drawing a white swatch for unknown kV
    // draws a hollow grey rectangle to give the appearance of a border around the white rectangle
    ctx.strokeStyle = 'rgba(76, 76, 76)';
    ctx.lineWidth = 1 * SCALE;
    ctx.strokeRect(x - 7 * SCALE, y - 7, 14 * SCALE, 14 * SCALE);  
  }
  text = obj.text;
  y = advance_for_type(y, ctx, text, text_offset, x);
  ctx.lineCap ='butt';
  return y;
}

/**
 * Draw grid class unknown and under 100 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas AC-lines-under-100-kV"
 * @param {Array} queued_data - the readfile from '/json/elec_grid_split/grid-unk_under_100.json'
 */
const draw_grid_class_ac_unk_and_under_100 = function draw_grid_class_ac_unk_and_under_100(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, ac_na, "grid-unk_under_100");
  draw_grid_class(ctx, queued_data, ac_under_100, "grid-unk_under_100");
};

/**
 * Draw grid class 100-300 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas AC-lines-100-to-300-kV"
 * @param {Array} queued_data - the readfile from '/json/elec_grid_split/grid-100_300.json' 
 */
const draw_grid_class_ac_100_300 = function draw_grid_class_ac_100_300(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, ac_100_200, "grid-100_300");
  draw_grid_class(ctx, queued_data, ac_200_300, "grid-100_300");
};

/**
 * Draw grid class 345-735 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas AC-lines-345-to-735-kV"
 * @param {Array} queued_data - the readfile from '/json/elec_grid_split/grid-345_735.json'
 */
const draw_grid_class_ac_345_735 = function draw_grid_class_ac_345_735(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, ac_345, "grid-345_735");
  draw_grid_class(ctx, queued_data, ac_500, "grid-345_735");
  draw_grid_class(ctx, queued_data, ac_735_plus, "grid-345_735");
};

/**
 * Draw grid class DC on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas DC-lines"
 * @param {Array} queued_data - the readfile from '/json/elec_grid_split/grid-dc'
 */
const draw_grid_class_dc = function draw_grid_class_dc (ctx, queued_data) {
  console.log('electrical-grid-dc-lines');
  draw_grid_class(ctx, queued_data, dc, "grid-dc");
}

// AC under 100

// TODO: The `name` property for ac_na isn't meaningful since it doesn't have its own canvas to connect to independently. This isn't a huge issue but it's not descriptive when you look at the object's prototype in the console. Consider a rewrite of the Grid constructor. 
// let ac_na_and_under_100 = new InfrastructureSet('AC-lines-under-100-kV', '', 102_000_000_000, 'electricity-transmission-and-distribution', [ {
//   f: draw_grid_class_ac_unk_and_under_100,
//   src: ['/static/json/elec_grid_split/grid-unk_under_100.json'],
//   w: d3.json,
// } ]);

let ac_na = new Grid('AC-lines-under-100-kV', 'Unknown kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_unk_and_under_100,
  src: ['/static/topojson/elec_grid_split/grid-unk_under_100.json'],
  w: d3.json,
} ], 'NOT AVAILABLE', 'rgba(255, 255, 255)', 0, 50);
console.log(ac_na)

let ac_under_100 = new Grid('AC-lines-under-100-kV', 'Under 100 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_unk_and_under_100,
  src: ['/static/topojson/elec_grid_split/grid-unk_under_100.json'],
  w: d3.json,
} ], 'Under 100', 'rgba(255, 255, 170)', 1, 50);
console.log(ac_under_100);

/**
 * Draw AC electric grid legend to its HTML5 canvas context.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Number} x - x axis
 * @param {Number} y - y axis
 * @returns {Number} y - updated y axis
 */
let draw_legend_ac_na_and_under_100 = function draw_legend_ac_na_and_under_100(ctx, x, y) {
  y = draw_legend_ac(ctx, x, y, ac_na);
  y = draw_legend_ac(ctx, x, y, ac_under_100);
  return y;
}

let ac_na_and_under_100 = new GridAcCollection('AC-lines-under-100-kV', 102_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_unk_and_under_100,
  src: ['/static/topojson/elec_grid_split/grid-unk_under_100.json'],
  w: d3.json,
} ], draw_legend_ac_na_and_under_100) //, [ac_na, ac_under_100]);

// AC 100-300

let ac_100_200 = new Grid('AC-lines-100-to-300-kV', '100–200 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_100_300,
  src: ['/static/topojson/elec_grid_split/grid-100_300.json'],
  w: d3.json,
} ], '100-161', 'rgba(86, 180, 233)', 2, 100);
console.log(ac_100_200); 

let ac_200_300 = new Grid('AC-lines-100-to-300-kV', '200–300 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_100_300,
  src: ['/static/topojson/elec_grid_split/grid-100_300.json'],
  w: d3.json,
} ], '220-287', 'rgba(55, 126, 184)', 3, 250);
console.log(ac_200_300); 

/**
 * Draw AC electric grid legend to its HTML5 canvas context.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Number} x - x axis
 * @param {Number} y - y axis
 * @returns {Number} y - updated y axis
 */
let draw_legend_ac_100_300 = function draw_legend_ac_100_300(ctx, x, y) {
  y = draw_legend_ac(ctx, x, y, ac_100_200);
  y = draw_legend_ac(ctx, x, y, ac_200_300);
  return y;
}

let ac_100_300 = new GridAcCollection('AC-lines-100-to-300-kV', 167_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_100_300,
  src: ['/static/topojson/elec_grid_split/grid-100_300.json'],
  w: d3.json,
} ], draw_legend_ac_100_300);

// AC 345-735

let ac_345 = new Grid('AC-lines-345-to-735-kV', '345 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/topojson/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ], '345', 'rgba(255, 149, 0)', 4, 350);
console.log(ac_345); 

let ac_500 = new Grid('AC-lines-345-to-735-kV', '500 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/topojson/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ], '500', 'rgba(213, 113, 45)', 5, 350);
console.log(ac_500); 

let ac_735_plus = new Grid('AC-lines-345-to-735-kV', '735 kV AC', null, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/topojson/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ], '735 and Above', 'rgba(228, 53, 5)', 6, 750);
console.log(ac_735_plus); 

/**
 * Draw AC electric grid legend to its HTML5 canvas context.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Number} x - x axis
 * @param {Number} y - y axis
 * @returns {Number} y - updated y axis
 */
let draw_legend_ac_345_735 = function draw_legend_ac_345_735(ctx, x, y) {
  y = draw_legend_ac(ctx, x, y, ac_345);
  y = draw_legend_ac(ctx, x, y, ac_500);
  y = draw_legend_ac(ctx, x, y, ac_735_plus);
  return y;
}

let ac_345_735 = new GridAcCollection('AC-lines-345-to-735-kV', 137_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_ac_345_735,
  src: ['/static/topojson/elec_grid_split/grid-345_735.json'],
  w: d3.json,
} ], draw_legend_ac_345_735);

let dc = new Grid('DC-lines', '500–1000 kV DC', 4_000_000_000, 'electricity-transmission-and-distribution', [ {
  f: draw_grid_class_dc,
  src: ['/static/topojson/elec_grid_split/grid-dc.json'],
  w: d3.json,
} ], 'DC', 'black', 7, 1000);
dc.dashed = false;
/**
 * Draw DC electric grid legend to its HTML5 canvas context. All params passed to draw_line() as a helper.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Number} x - x axis
 * @param {Number} y - y axis
 * @param {boolean} dashed - true if line should be dashed, false if solid
 * @returns {Number} y - updated y axis
 */
dc.draw_legend = function draw_grid_dc_legend(ctx, x, y, dashed) {
  ctx.lineWidth = LEGEND_FONT_SIZE;
  ctx.strokeStyle = this.color;
  ctx.Linecap = 'butt'
  text = this.text;
  y = draw_line(ctx, x, y, this, dashed, text)
  ctx.strokeLinecap = 'round'
  return y;
};

let distribution = { name: 'electricity-distribution',
value: 1_400_000_000_000,
draw: false,
column: 'electricity-transmission-and-distribution',
};