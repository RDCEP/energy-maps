/**
 * @file Provides draw functions and any helpers for the electric grid, subdivided into separate classes.
 * @author Benjamin Kleeman
 * @author Nathan Matteson
 * @module Grid
 */

 /**
 * A collection of electric grid classifications, used to filter out and render separate portions of the grid.
 * @type {Object} 
 * @property {string} identifier - an abbreviation of the class name in the data file
 * @property {string} name - a nested property; cooresponds to class heading in data file 
 * @property {string} value - a nested property; used for mathematical operations that call this object 
 * @property {Number} nominal voltage - system voltage for which grid class (values are estimates)
 */
 let grid_classes = {
  AC_NA: {
    name: 'NOT AVAILABLE',
    color: 0,
    line_width: 0,
    nominal_voltage: 50
  },
  AC_UNDER_100: { 
    name: 'Under 100',
    color: 1,
    line_width: 1,
    nominal_voltage: 50
  },
  AC_100_200: {
    name: '100-161',
    color: 2,
    line_width: 2,
    nominal_voltage: 100
  }, 
  AC_200_300: {
    name: '220-287',
    color: 3,
    line_width: 3,
    nominal_voltage: 250
  }, 
  AC_345: {
    name: '345',
    color: 4,
    line_width: 4,
    nominal_voltage: 350
  }, 
  AC_500: {
    name: '500',
    color: 5,
    line_width: 5,
    nominal_voltage: 500 
  }, 
  AC_735_PLUS: {
    name: '735 and Above',
    color: 6,
    line_width: 6,
    nominal_voltage: 750
  },
  DC: {
    name: 'DC',
    color: 'black',
    line_width: 7,
    nominal_voltage: 1000
  }
};

/**
 * Get the features you want from your GeoJSON FeatureCollection.
 * @param {Object} infrastructure - readfile
 * @param {Number} c - `grid_classes` object member to compare readfile against
 * @returns {Array} features - an array of features matching the filtered class(es)
 */
const filter_features = function filter_features(infrastructure, c) {
  let features = infrastructure.features.filter(function(d) {
    return d.properties.class === c.name;
  });
  return features;
}

/**
 * Format electric grid line width for the calling grid class object. 
 * Create an exponential response curve between voltages and line widths
 * to ensure that the lines that represent large voltages aren't too large visually.
 * @param {Number} value - the value to be scaled, bound to the line_width 
 * property of the corresponding `grid_classes` object 
 * @param {Number} divisor - sets line inflection point to adjust the scale of the line width as `value` grows. Must be at least half the size of `value` to get a decent inflection point. Helps determine the mid point of the curve.
 */
const set_line_width = function set_line_width(value, divisor) {
  // TODO: Set nominal voltage as a property of the grid object
  return SCALE * (1 + 3 / (1 + Math.exp(-3 * (value / divisor - 1))));
}

/**
 * Draw a grid class on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context
 * @param {Array} xy - Array of xy coordinates 
 * @param {Object} c - object member of `grid_classes`
 */
draw_grid_class = function draw_grid_class(ctx, queued_data, c) {
  let grid = queued_data[0];
  const path = get_path(ctx);
  let tmp_grid = {type: 'FeatureCollection', features: []};
  
  ctx.lineCap = 'round';

  features = filter_features(grid, c);

  let feat_len = features.length;
  for (let i = 0; i < feat_len; ++i) {
    tmp_grid.features = [features[i]];

    if (c == grid_classes.DC) {
      // console.log("color is" + c.color)
      ctx.lineWidth = set_line_width(features[i]['properties']['voltage'], 500);
      ctx.strokeStyle = c.color;
    } 
    
    else {
      ctx.lineWidth = set_line_width(features[i]['properties']['voltage'], 500);
      ctx.strokeStyle = viz.grid.palette[c.color];
    }

    ctx.beginPath();
    path(tmp_grid);
    ctx.stroke();

      if (i === feat_len - 1) { 
        hide_spinner(); 
      }
    }
};

/**
 * Draw grid class unknown and under 100 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas AC-lines-under-100-kV"
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_ac_unk_and_under_100 = function draw_grid_class_ac_unk_and_under_100(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, grid_classes.AC_NA);
  draw_grid_class(ctx, queued_data, grid_classes.AC_UNDER_100);
};

/**
 * Draw grid class 100-300 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas AC-lines-100-to-300-kV"
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_ac_100_300 = function draw_grid_class_ac_100_300(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, grid_classes.AC_100_200);
  draw_grid_class(ctx, queued_data, grid_classes.AC_200_300);
};

/**
 * Draw grid class 345-735 on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas AC-lines-345-to-735-kV"
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_ac_345_735 = function draw_grid_class_ac_345_735(ctx, queued_data) {
  draw_grid_class(ctx, queued_data, grid_classes.AC_345);
  draw_grid_class(ctx, queued_data, grid_classes.AC_500);
  draw_grid_class(ctx, queued_data, grid_classes.AC_735_PLUS);
};

/**
 * Draw grid class DC on the electric grid infrastructure map.
 * @param {Object} ctx - HTML5 canvas context: bound to canvas "map layer canvas DC-lines"
 * @param {Array} xy - Array of xy coordinates 
 */
const draw_grid_class_dc = function draw_grid_class_dc (ctx, queued_data) {
  console.log('electrical-grid-dc-lines');
  draw_grid_class(ctx, queued_data, grid_classes.DC);
}